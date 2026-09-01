import { createFileRoute } from "@tanstack/react-router";
import { getWorkflow } from "@/domain/workflows";
import { requireAuthenticatedUser } from "@/platform/supabase";
import { uploadDocument } from "@/platform/mailmypdf";
import { resolveAI } from "@/platform/control-plane-ai";

function mediaType(file: File): "application/pdf" | "image/png" | "image/jpeg" {
  if (file.type === "application/pdf") return "application/pdf";
  if (file.type === "image/png") return "image/png";
  if (file.type === "image/jpeg") return "image/jpeg";
  throw new Error("Please upload a PDF, PNG, or JPEG document.");
}

async function callGemini(cfg: { apiKey: string; model: string; promptOverride?: string | null }, file: File, prompt: string) {
  const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent?key=${encodeURIComponent(cfg.apiKey)}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ inlineData: { mimeType: mediaType(file), data: bytes } }, { text: cfg.promptOverride || prompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.1 },
    }),
  });
  const body = await response.json().catch(() => null) as any;
  if (!response.ok) throw new Error(body?.error?.message || `Gemini analysis failed (${response.status}).`);
  const text = body?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
  if (!text) throw new Error("Gemini returned no analysis.");
  try { return JSON.parse(text); } catch { throw new Error("Gemini returned invalid structured analysis."); }
}

export const Route = createFileRoute("/api/workflows/$workflowId/analyze")({ server: { handlers: { POST: async ({ request, params }) => {
  try {
    const user = await requireAuthenticatedUser(request);
    const workflow = getWorkflow(params.workflowId);
    const form = await request.formData();
    const file = form.get("document");
    if (!(file instanceof File)) return Response.json({ error: "A source document is required." }, { status: 400 });
    if (file.size === 0) return Response.json({ error: "The source document is empty." }, { status: 400 });
    if (file.size > 20 * 1024 * 1024) return Response.json({ error: "Source documents must be 20 MB or smaller." }, { status: 413 });
    const document = await uploadDocument(file);
    const config = await resolveAI(params.workflowId, "analysis");
    if (config.provider !== "gemini") throw new Error(`Workflow analysis provider ${config.provider} is not yet wired for binary document input; configure Gemini for document analysis or use the extraction task.`);
    const prompt = [
      `Workflow: ${workflow.title}`,
      `Customer problem: ${workflow.description}`,
      `Primary search intent: ${workflow.primaryKeyword || "specialized appeal/response"}`,
      `Domain focus: ${workflow.focusAreas.join(", ")}`,
      workflow.workflowPrompt,
      "Return strict JSON only.",
      "Never invent facts, dates, policy language, amounts, medical facts, deadlines, or outcomes.",
      '{"summary":"","decision":"","decisionType":"","issuer":"","referenceNumber":"","decisionDate":"","deadline":"","reasons":[],"keyFacts":[],"issues":[{"issue":"","whyItMatters":"","evidenceNeeded":[]}],"evidenceMentioned":[],"uncertainties":[],"confidence":"high|medium|low"}',
    ].join("\n");
    const analysis = await callGemini(config, file, prompt);
    return Response.json({ ok: true, userId: user.id, workflowId: workflow.id, workflow: { title: workflow.title, primaryKeyword: workflow.primaryKeyword }, document, analysis, provider: config.provider, model: config.model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to analyze document.";
    return Response.json({ error: message }, { status: /authentication|required/i.test(message) ? 401 : 502 });
  }
} } });
