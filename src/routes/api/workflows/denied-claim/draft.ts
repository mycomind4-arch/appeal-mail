import { createAPIFileRoute } from "@tanstack/react-start";

type ProviderConfig = {
  provider: "anthropic" | "openai" | "gemini";
  apiKey: string;
  apiBaseUrl?: string | null;
  model: string;
  promptOverride?: string | null;
};

async function resolveProvider(task: "draft" | "validation") {
  const base = process.env.MAILMYPDF_CONTROL_PLANE_URL || "https://mailmypdf.com";
  const token = process.env.MAILMYPDF_CONTROL_PLANE_TOKEN;
  if (!token) throw new Error("MailMyPDF control-plane token is not configured.");
  const response = await fetch(`${base.replace(/\/$/, "")}/api/control-plane/ai`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ verticalSlug: "appeal-mail", workflowSlug: "denied-claim", task }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Control plane error (${response.status}).`);
  return payload as ProviderConfig;
}

async function callModel(config: ProviderConfig, system: string, user: string) {
  if (config.provider === "anthropic") {
    const response = await fetch(config.apiBaseUrl || "https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": config.apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: config.model, max_tokens: 7000, temperature: 0.4, system: config.promptOverride || system, messages: [{ role: "user", content: user }] }),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.error?.message || `Anthropic request failed (${response.status}).`);
    return body?.content?.filter((item: { type?: string }) => item.type === "text").map((item: { text?: string }) => item.text || "").join("") || "";
  }

  if (config.provider === "openai") {
    const response = await fetch(config.apiBaseUrl || "https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({ model: config.model, temperature: 0.2, input: [{ role: "system", content: [{ type: "input_text", text: config.promptOverride || system }] }, { role: "user", content: [{ type: "input_text", text: user }] }] }),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.error?.message || `OpenAI request failed (${response.status}).`);
    return body?.output_text || body?.output?.flatMap((item: { content?: Array<{ text?: string }> }) => item.content || []).map((item: { text?: string }) => item.text || "").join("") || "";
  }

  throw new Error(`Unsupported drafting provider: ${config.provider}`);
}

export const APIRoute = createAPIFileRoute("/api/workflows/denied-claim/draft")({
  POST: async ({ request }) => {
    try {
      const payload = await request.json() as { extracted?: unknown; analysis?: unknown };
      if (!payload.extracted || !payload.analysis) return Response.json({ error: "Analysis results are required." }, { status: 400 });

      const draftConfig = await resolveProvider("draft");
      const validationConfig = await resolveProvider("validation");
      const draft = await callModel(
        draftConfig,
        "Draft a persuasive, factual appeal response from the supplied case analysis. Clearly distinguish established facts from arguments. Cite the underlying evidence references supplied in the case. Do not invent facts, dates, policy language, or outcomes. Return only the response letter.",
        JSON.stringify({ extracted: payload.extracted, analysis: payload.analysis }),
      );
      if (!draft.trim()) throw new Error("Drafting provider returned an empty response.");

      const validation = await callModel(
        validationConfig,
        "Audit this appeal draft against the supplied analysis. Identify unsupported facts, missing evidence, contradictions, deadline problems, tone problems, or other material defects. Return concise JSON with valid:boolean, issues:string[], suggestions:string[].",
        JSON.stringify({ analysis: payload.analysis, draft }),
      );

      return Response.json({ ok: true, draft, validation, draftProvider: draftConfig.provider, validationProvider: validationConfig.provider });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Unable to create appeal draft." }, { status: 502 });
    }
  },
});
