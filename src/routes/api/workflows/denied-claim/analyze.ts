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

export const APIRoute = createAPIFileRoute("/api/workflows/denied-claim/analyze")({
  POST: async ({ request }) => {
    try {
      const form = await request.formData();
      const file = form.get("document");
      if (!(file instanceof File)) return Response.json({ error: "A source document is required." }, { status: 400 });
      if (file.size === 0) return Response.json({ error: "The source document is empty." }, { status: 400 });
      if (file.size > 20 * 1024 * 1024) return Response.json({ error: "Source documents must be 20 MB or smaller." }, { status: 413 });

      const provider = await resolveProvider("analysis");
      if (provider.provider !== "gemini") throw new Error("Denied Claim is currently configured for Gemini. Add another provider in the MailMyPDF admin control plane when ready.");

      const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(provider.model)}:generateContent?key=${encodeURIComponent(provider.apiKey)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { inlineData: { mimeType: mediaType(file), data: bytes } },
              {
                text: provider.promptOverride || [
                  "You are the document-intelligence analyst for a denied-claim appeal workflow.",
                  "Analyze the supplied denial document and return strict JSON only.",
                  "Extract only information supported by the document. Never invent facts, dates, policy language, diagnoses, amounts, deadlines, or outcomes.",
                  "Return this shape:",
                  '{"summary":"","decision":"","decisionType":"","issuer":"","referenceNumber":"","decisionDate":"","deadline":"","denialReasons":[],"keyFacts":[],"issues":[{"issue":"","whyItMatters":"","evidenceNeeded":[]}],"evidenceMentioned":[],"sourceCitations":[{"page":0,"claim":""}],"uncertainties":[],"confidence":"high|medium|low"}',
                  "Use empty strings or arrays when the document does not provide a value.",
                ].join("\\n"),
              },
            ],
          }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
        }),
      });
      const body = await response.json().catch(() => null) as any;
      if (!response.ok) throw new Error(body?.error?.message || `Gemini analysis failed (${response.status}).`);
      const text = body?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
      if (!text) throw new Error("Gemini returned no analysis.");

      let analysis: unknown;
      try { analysis = JSON.parse(text); } catch { throw new Error("Gemini returned invalid structured analysis."); }

      return Response.json({ ok: true, workflowId: "denied-claim", fileName: file.name, analysis, provider: "gemini", model: provider.model });
    } catch (error) {
      return Response.json({ error: error instanceof Error ? error.message : "Unable to analyze document." }, { status: 502 });
    }
  },
});
