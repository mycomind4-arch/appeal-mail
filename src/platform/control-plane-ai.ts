/**
 * Control Plane AI — MIGRATED to @mailmypdf/ai bridge.
 * Credential resolution stays here (control plane API).
 * Provider calls route through the shared bridge.
 */
import { callLLMWithCredentials } from '@/platform/llm-bridge';

export type AIProvider = 'anthropic' | 'openai' | 'gemini';
export type AITask = 'analysis' | 'draft' | 'validation' | 'extraction' | 'revision';

interface AIConfig { provider: AIProvider; apiKey: string; apiBaseUrl?: string | null; model: string; promptOverride?: string | null; }

function config() {
  const baseUrl = process.env.MAILMYPDF_CONTROL_PLANE_URL;
  const token = process.env.MAILMYPDF_CONTROL_PLANE_TOKEN;
  if (!baseUrl || !token) throw new Error('MAILMYPDF_CONTROL_PLANE_URL and MAILMYPDF_CONTROL_PLANE_TOKEN are required');
  return { baseUrl: baseUrl.replace(/\/$/, ''), token };
}

export async function resolveAI(workflowSlug: string, task: AITask): Promise<AIConfig> {
  const { baseUrl, token } = config();
  const response = await fetch(`${baseUrl}/api/control-plane/ai`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ verticalSlug: 'appeal-mail', workflowSlug, task }),
  });
  if (!response.ok) throw new Error(`MailMyPDF control-plane lookup failed: ${response.status}`);
  return await response.json() as AIConfig;
}

function parseJson(text: string): any {
  const cleaned = text.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(cleaned); } catch { throw new Error('AI provider returned invalid JSON'); }
}

export async function analyzeDeniedClaim(input: { documentText: string; facts: Record<string, string>; objective: string }) {
  const cfg = await resolveAI('denied-claim', 'analysis');
  const prompt = cfg.promptOverride || 'Analyze this denied-claim appeal case. Separate document facts from user assertions. Identify contradictions, deadline issues, missing evidence, appeal grounds, and unresolved questions. Never invent facts.';
  const text = await callLLMWithCredentials(cfg, prompt, JSON.stringify({ workflow: 'denied-claim', documentText: input.documentText, facts: input.facts, objective: input.objective, output: { findings: [], facts: [], evidenceGaps: [], grounds: [], deadline: null, blockingIssues: [] } }), true);
  const result = parseJson(text);
  return { provider: cfg.provider, model: cfg.model, result };
}

export async function draftDeniedClaim(input: { analysis: unknown; workflowFacts: Record<string, string>; objective: string }) {
  const cfg = await resolveAI('denied-claim', 'draft');
  const prompt = cfg.promptOverride || 'Draft a professional denied-claim appeal using only verified case facts and supported grounds. Preserve uncertainty. Do not promise outcomes. Return only the letter.';
  const text = await callLLMWithCredentials(cfg, prompt, JSON.stringify(input));
  return { provider: cfg.provider, model: cfg.model, draft: text };
}

export async function validateDeniedClaim(input: { analysis: unknown; draft: string }) {
  const cfg = await resolveAI('denied-claim', 'validation');
  const prompt = cfg.promptOverride || 'Validate this denied-claim appeal draft against the analysis. Reject unsupported facts, missing critical evidence, unresolved deadlines, legal overclaims, or placeholders. Return JSON {valid:boolean,issues:string[]}.';
  const text = await callLLMWithCredentials(cfg, prompt, JSON.stringify(input), true);
  return { provider: cfg.provider, model: cfg.model, validation: parseJson(text) };
}
