import { createAPIFileRoute } from "@tanstack/react-start";
import { requireAuthenticatedUser } from "@/platform/supabase";

type ProviderConfig = { provider: "anthropic" | "openai" | "gemini"; apiKey: string; apiBaseUrl?: string | null; model: string; promptOverride?: string | null };

async function resolveProvider(task: "draft" | "validation") {
  const base = process.env.MAILMYPDF_CONTROL_PLANE_URL || "https://mailmypdf.com";
  const token = process.env.MAILMYPDF_CONTROL_PLANE_TOKEN;
  if (!token) throw new Error("MailMyPDF control-plane token is not configured.");
  const response = await fetch(`${base.replace(/\/$/, "")}/api/control-plane/ai`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ verticalSlug: "appeal-mail", workflowSlug: "denied-claim", task }) });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || `Control plane error (${response.status}).`);
  return payload as ProviderConfig;
}

async function callGemini(config: ProviderConfig, system: string, user: string) {
  if (config.provider !== "gemini") throw new Error(`Denied Claim currently requires Gemini; control plane returned ${config.provider}.`);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: `${config.promptOverride || system}\n\n${user}` }] }], generationConfig: { temperature: 0.2 } }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error?.message || `Gemini request failed (${response.status}).`);
  const text = body?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "";
  if (!text) throw new Error("Gemini returned no response.");
  return text;
}

export const APIRoute = createAPIFileRoute("/api/workflows/denied-claim/draft")({
  POST: async ({ request }) => {
    try {
      await requireAuthenticatedUser(request);
      const payload = await request.json() as { extracted?: unknown; analysis?: unknown };
      if (!payload.extracted || !payload.analysis) return Response.json({ error: "Analysis results are required." }, { status: 400 });
      const draftConfig = await resolveProvider("draft");
      const validationConfig = await resolveProvider("validation");
      const draft = await callGemini(draftConfig, "Draft a persuasive, factual appeal response from the supplied case analysis. Distinguish established facts from arguments. Cite supplied evidence references. Never invent facts, dates, policy language, or outcomes. Return only the response letter.", JSON.stringify({ extracted: payload.extracted, analysis: payload.analysis }));
      const validation = await callGemini(validationConfig, "Audit this appeal draft against the supplied analysis. Identify unsupported facts, missing evidence, contradictions, deadline problems, tone problems, and material defects. Return concise JSON with valid:boolean, issues:string[], suggestions:string[].", JSON.stringify({ analysis: payload.analysis, draft }));
      return Response.json({ ok: true, draft, validation, draftProvider: draftConfig.provider, validationProvider: validationConfig.provider });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create appeal draft.";
      const status = /authentication|required|token/i.test(message) ? 401 : 502;
      return Response.json({ error: message }, { status });
    }
  },
});
