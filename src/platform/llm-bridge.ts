/**
 * LLM Bridge — adapts @mailmypdf/ai's shared router to appeal-mail's
 * existing LLM service API.
 *
 * Appeal-mail uses a simpler API surface than immigration-mail:
 *   - callLLM(messages, config) — single provider, auto-fallback
 *   - getAvailableProviders() — list configured providers
 *   - No task routing (appeal-mail picks provider directly)
 *
 * This bridge routes all calls through the shared @mailmypdf/ai router,
 * which handles provider adapters, retries, and fallback.
 */

import {
  routeLLMRequest,
  callMultipleProviders,
  getLLMConfig,
  _setLLMConfig,
  _resetLLMConfig,
  isLLMAvailable,
  getConfiguredProviderList,
  type LLMProviderId,
  type LLMOperation,
  type LLMFullProvenance,
  type LLMRequest,
  type RouterResult,
} from '@mailmypdf/ai';

// ── Appeal-mail's provider naming ──────────────────────────────────────
//
// Appeal-mail uses "gemini" | "claude" | "openai" (same as immigration).
// The shared package uses "gemini" | "openai" | "anthropic".
// We map "claude" ↔ "anthropic".

function mapProviderName(name: string): LLMProviderId | null {
  switch (name) {
    case 'gemini': return 'gemini';
    case 'claude':
    case 'anthropic': return 'anthropic';
    case 'openai': return 'openai';
    default: return null;
  }
}

// ── Types matching the old llm-service.ts API ───────────────────────────

export type LLMProvider = 'gemini' | 'claude' | 'openai';

export interface LLMConfig {
  provider: LLMProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  text: string;
  provider: LLMProvider;
  model: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
  provenance?: LLMFullProvenance;
}

// ── Provider status (backward-compatible) ──────────────────────────────

export function getAvailableProviders(): LLMProvider[] {
  const configured = getConfiguredProviderList(getLLMConfig());
  return configured.map((p) => p === 'anthropic' ? 'claude' : p as LLMProvider);
}

export function isProviderAvailable(provider: LLMProvider): boolean {
  const mapped = mapProviderName(provider);
  if (!mapped) return false;
  return getConfiguredProviderList(getLLMConfig()).includes(mapped);
}

export function getProviderLabel(provider: LLMProvider): string {
  const labels: Record<LLMProvider, string> = {
    gemini: 'Google Gemini',
    claude: 'Anthropic Claude',
    openai: 'OpenAI GPT-4o',
  };
  return labels[provider] ?? provider;
}

export function getDefaultModel(provider: LLMProvider): string {
  const models: Record<LLMProvider, string> = {
    gemini: 'gemini-3.6-flash',
    claude: 'claude-sonnet-4-20250514',
    openai: 'gpt-4o',
  };
  return models[provider] ?? 'unknown';
}

// ── Main LLM call (replaces callLLM from llm-service.ts) ───────────────

export async function callLLM(
  messages: LLMMessage[],
  config: LLMConfig,
): Promise<LLMResponse> {
  if (!isLLMAvailable()) {
    throw new Error('No LLM provider is configured. Set GEMINI_API_KEY, ANTHROPIC_API_KEY, or OPENAI_API_KEY.');
  }

  const mappedProvider = mapProviderName(config.provider);
  if (!mappedProvider) {
    // Fall back to first available
    const available = getAvailableProviders();
    if (available.length === 0) {
      throw new Error('No LLM provider is configured.');
    }
    return callLLM(messages, { ...config, provider: available[0] });
  }

  const systemPrompt = messages.find((m) => m.role === 'system')?.content ?? '';
  const userPrompt = messages
    .filter((m) => m.role !== 'system')
    .map((m) => m.content)
    .join('\n\n');

  const request: LLMRequest = {
    systemPrompt,
    userPrompt,
    temperature: config.temperature,
    maxTokens: config.maxTokens,
  };

  const result = await routeLLMRequest(request, {
    operation: 'analyze',
    provider: mappedProvider,
    // Allow fallback if the primary provider is not available
  });

  if (!result) {
    throw new Error(`Provider ${config.provider} is not available and no fallback succeeded.`);
  }

  const providerName: LLMProvider = result.provenance.provider === 'anthropic' ? 'claude' : result.provenance.provider as LLMProvider;

  return {
    text: result.content,
    provider: providerName,
    model: result.provenance.model,
    provenance: result.provenance,
  };
}

// ── Multi-provider consensus (replaces multi-llm-consensus.ts) ─────────

export interface AppealConsensusResult {
  text: string;
  provider: LLMProvider;
  model: string;
  confidence: number;
  agreement: number;
  providers: LLMProvider[];
  disagreements: LLMProvider[];
  warnings: string[];
}

export async function callMultipleProvidersForConsensus(
  messages: LLMMessage[],
  providers: LLMProvider[],
  baseConfig: Omit<LLMConfig, 'provider'>,
): Promise<AppealConsensusResult> {
  const mappedProviders = providers
    .map(mapProviderName)
    .filter((p): p is LLMProviderId => p !== null);

  const systemPrompt = messages.find((m) => m.role === 'system')?.content ?? '';
  const userPrompt = messages
    .filter((m) => m.role !== 'system')
    .map((m) => m.content)
    .join('\n\n');

  const result = await callMultipleProviders(
    { systemPrompt, userPrompt, temperature: baseConfig.temperature, maxTokens: baseConfig.maxTokens },
    mappedProviders,
    { operation: 'analyze' },
  );

  // Fingerprint + rank by agreement (same logic as old consensus)
  function fingerprint(text: string): string {
    return text.trim().toLowerCase().replace(/\s+/g, ' ').slice(0, 500);
  }

  const successful = result.responses.map((r) => ({
    text: r.content,
    provider: (r.provider === 'anthropic' ? 'claude' : r.provider) as LLMProvider,
    model: r.model,
  }));

  if (successful.length === 0) {
    throw new Error('MULTI_LLM_RESULT_QUORUM_NOT_MET: no providers succeeded');
  }

  const groups = new Map<string, typeof successful>();
  for (const item of successful) {
    const key = fingerprint(item.text);
    const existing = groups.get(key) ?? [];
    existing.push(item);
    groups.set(key, existing);
  }

  const ranked = [...groups.values()].sort((a, b) => {
    if (b.length !== a.length) return b.length - a.length;
    return b[0].text.length - a[0].text.length;
  });

  const winner = ranked[0] ?? [];
  if (winner.length === 0) throw new Error('No LLM result available');

  const agreement = winner.length / successful.length;
  const disagreements = ranked.slice(1).flatMap((group) => group.map((item) => item.provider));

  const result2: AppealConsensusResult = {
    text: winner[0].text,
    provider: winner[0].provider,
    model: winner[0].model,
    confidence: Math.min(1, agreement * 0.9 + 0.1),
    agreement,
    providers: successful.map((item) => item.provider),
    disagreements,
    warnings: result.partialFailure ? ['Some providers failed'] : [],
  };

  if (agreement < 0.67) {
    result2.warnings.push('MULTI_LLM_DISAGREEMENT_REQUIRES_REVIEW');
  }

  return result2;
}

// ── Test helpers ────────────────────────────────────────────────────────

export { _setLLMConfig, _resetLLMConfig };

// ── Control Plane Credential Resolution ──────────────────────────────────

export interface ResolvedLLMConfig {
  provider: string;
  apiKey: string;
  model: string;
  promptOverride?: string;
}

/**
 * Resolve LLM credentials from the MailMyPDF control plane.
 * Replaces the per-route resolveGemini() pattern.
 */
export async function resolveLLMCredentials(
  workflowSlug: string,
  task: string,
): Promise<ResolvedLLMConfig> {
  const base = process.env.MAILMYPDF_CONTROL_PLANE_URL || 'https://mailmypdf.com';
  const token = process.env.MAILMYPDF_CONTROL_PLANE_TOKEN;
  if (!token) throw new Error('MailMyPDF control-plane token is not configured.');
  const response = await fetch(`${base.replace(/\/$/, '')}/api/control-plane/ai`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ verticalSlug: 'appeal-mail', workflowSlug, task }),
  });
  const payload = await response.json().catch(() => null) as ResolvedLLMConfig | null;
  if (!response.ok || !payload?.apiKey || !payload.model) {
    throw new Error('Gemini configuration is unavailable for this workflow.');
  }
  return payload;
}

/**
 * Call Gemini with a document (multimodal) — for analyze.ts route handlers.
 * Sends inlineData (base64 document) + text prompt to Gemini and returns text + provenance.
 */
export async function callLLMDocument(
  config: ResolvedLLMConfig,
  mediaType: string,
  base64Data: string,
  prompt: string,
  options?: { temperature?: number; responseMimeType?: string },
): Promise<{ text: string; provenance: LLMFullProvenance }> {
  const model = config.model;
  const apiKey = config.apiKey;
  const textPrompt = config.promptOverride || prompt;
  const temperature = options?.temperature ?? 0.1;
  const responseMimeType = options?.responseMimeType ?? 'application/json';

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [
                { inlineData: { mimeType: mediaType, data: base64Data } },
                { text: textPrompt },
              ],
            }],
            generationConfig: { responseMimeType, temperature },
          }),
        },
      );
      const body = await response.json().catch(() => null) as any;
      if (!response.ok) throw new Error(body?.error?.message || `Gemini request failed (${response.status}).`);
      const text = body?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('').trim();
      if (!text) throw new Error('Gemini returned no response.');
      return {
        text,
        provenance: {
          provider: 'gemini',
          model,
          generatedAt: new Date().toISOString(),
          inputHash: '',
          promptVersion: undefined,
        },
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError ?? new Error('Gemini document analysis failed.');
}

/**
 * Call Gemini with text only — for draft.ts and validate.ts route handlers.
 * Replaces the per-route callGemini() pattern.
 */
export async function callLLMText(
  config: ResolvedLLMConfig,
  prompt: string,
  options?: { temperature?: number; responseMimeType?: string },
): Promise<{ text: string; provenance: LLMFullProvenance }> {
  const model = config.model;
  const apiKey = config.apiKey;
  const textPrompt = config.promptOverride || prompt;
  const temperature = options?.temperature ?? 0.2;
  const responseMimeType = options?.responseMimeType;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= 2; attempt++) {
    try {
      const body: any = {
        contents: [{ role: 'user', parts: [{ text: textPrompt }] }],
        generationConfig: { temperature, ...(responseMimeType ? { responseMimeType } : {}) },
      };
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        },
      );
      const respBody = await response.json().catch(() => null) as any;
      if (!response.ok) throw new Error(respBody?.error?.message || `Gemini request failed (${response.status}).`);
      const text = respBody?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('').trim();
      if (!text) throw new Error('Gemini returned no response.');
      return {
        text,
        provenance: {
          provider: 'gemini',
          model,
          generatedAt: new Date().toISOString(),
          inputHash: '',
          promptVersion: undefined,
        },
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  throw lastError ?? new Error('Gemini text generation failed.');
}

/**
 * Multi-provider text call with injected credentials — replaces control-plane-ai.ts
 * callProvider(). Supports Gemini, OpenAI, and Anthropic with credentials from
 * the control plane (not env vars).
 */
export async function callLLMWithCredentials(
  config: { provider: string; apiKey: string; apiBaseUrl?: string | null; model: string; promptOverride?: string | null },
  system: string,
  user: string,
  json = false,
): Promise<string> {
  const base = (config.apiBaseUrl || (
    config.provider === 'gemini' ? 'https://generativelanguage.googleapis.com' :
    config.provider === 'openai' ? 'https://api.openai.com' :
    'https://api.anthropic.com'
  )).replace(/\/$/, '');
  
  let response: Response;
  
  if (config.provider === 'anthropic') {
    response = await fetch(`${base}/v1/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': config.apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: config.model, max_tokens: 7000, system, messages: [{ role: 'user', content: user }] }),
    });
    if (!response.ok) throw new Error(`Anthropic request failed: ${response.status}`);
    const body = await response.json() as any;
    return body.content?.filter((x: any) => x.type === 'text').map((x: any) => x.text).join('\n').trim() ?? '';
  }
  
  if (config.provider === 'openai') {
    response = await fetch(`${base}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        response_format: json ? { type: 'json_object' } : undefined,
        messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      }),
    });
    if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`);
    const body = await response.json() as any;
    return body.choices?.[0]?.message?.content?.trim() ?? '';
  }
  
  // Gemini (default)
  response = await fetch(`${base}/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: 'user', parts: [{ text: config.promptOverride || user }] }],
      generationConfig: { temperature: 0.2, responseMimeType: json ? 'application/json' : 'text/plain' },
    }),
  });
  if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
  const body = await response.json() as any;
  return body.candidates?.[0]?.content?.parts?.map((p: any) => p.text || '').join('').trim() ?? '';
}
