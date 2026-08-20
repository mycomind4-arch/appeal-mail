import { createAPIFileRoute } from "@tanstack/react-start";

type ProviderConfig = {
  provider: "anthropic" | "openai" | "gemini";
  apiKey: string;
  apiBaseUrl?: string | null;
  model: string;
  promptOverride?: string | null;
};

async function resolveProvider(task: "analysis" | "extraction" | "draft" | "validation") {
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

function mediaType(file: File): "application/pdf" | "image/png" | "image/jpeg" {
  if (file.type === "application/pdf") return "application/pdf";
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/jpeg") return "image/jpeg";
  throw new Error("Denied Claim currently accepts PDF, PNG, and JPEG source documents.");
}

async function callGemini(config: ProviderConfig, file: File) {
  const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [
        { inlineData: { mimeType: mediaType(file), data: bytes } },
        { text: `${config.promptOverride || "Extract the denial document faithfully."}\nReturn strict JSON with: summary, decision, deadline, denialReasons, facts, evidenceMentions, uncertainties. Do not invent facts.` },
      ] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
    }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error?.message || `Gemini extraction failed (${response.status}).`);
  const text = body?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("") || "";
  if (!text) throw new Error("Gemini returned no extraction result.");
  try { return JSON.parse(text); } catch { throw new Error("Gemini returned invalid structured extraction."); }
}

async function callClaude(config: ProviderConfig, extracted: unknown) {
  const response = await fetch(config.apiBaseUrl || "https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 5000,
      temperature: 0.2,
      system: config.promptOverride || "You are the primary appeal case analyst. Analyze only the supplied evidence. Identify the decision, reasons, deadlines, factual vulnerabilities, missing evidence, contradictions, and strongest defensible grounds. Never invent facts.",
      messages: [{ role: "user", content: JSON.stringify(extracted) }],
    }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error?.message || `Claude analysis failed (${response.status}).`);
  const text = body?.content?.filter((item: { type?: string }) => item.type === "text").map((item: { text?: string }) => item.text || "").join("") || "";
  if (!text) throw new Error("Claude returned no analysis result.");
  return { analysisText: text, extracted };
}

export const APIRoute = createAPIFileRoute("/api/workflows/denied-claim/analyze")({
  POST: async ({ request }) => {
    try {
      const form = await request.formData();
      const file = form.get("document");
      if (!(file instanceof File)) return Response.json({ error: "A source document is required." }, { status: 400 });
      if (file.size > 20 * 1024 * 1024) return Response.json({ error: "Source documents must be 20 MB or smaller." }, { status: 413 });

      const extractionConfig = await resolveProvider("extraction");
      if (extractionConfig.provider !== "gemini") throw new Error("Denied Claim extraction must be routed to the configured Gemini provider.");
      const analysisConfig = await resolveProvider("analysis");
      if (analysisConfig.provider !== "anthropic") throw new Error("Denied Claim analysis must be routed to the configured Claude provider.");

      const extracted = await callGemini(extractionConfig, file);
      const analysis = await callClaude(analysisConfig, extracted);
      return Response.json({ ok: true, workflowId: "denied-claim", fileName: file.name, extracted, analysis });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Unable to analyze document." }, { status: 502 });
    }
  },
});
