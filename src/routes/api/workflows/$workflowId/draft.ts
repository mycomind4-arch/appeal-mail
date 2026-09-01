import { createFileRoute } from "@tanstack/react-router";
import { getWorkflow } from "@/domain/workflows";
import { requireAuthenticatedUser } from "@/platform/supabase";
import { resolveAI } from "@/platform/control-plane-ai";


async function callGemini(config: { apiKey: string; model: string; promptOverride?: string }, prompt: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: config.promptOverride || prompt }] }], generationConfig: { temperature: 0.2 } }),
  });
  const body = await response.json().catch(() => null) as any;
  if (!response.ok) throw new Error(body?.error?.message || `Gemini request failed (${response.status}).`);
  const text = body?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
  if (!text) throw new Error("Gemini returned no response.");
  return text;
}

export const Route = createFileRoute("/api/workflows/$workflowId/draft")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          await requireAuthenticatedUser(request);
          const workflow = getWorkflow(params.workflowId);
          const payload = await request.json() as { analysis?: unknown };
          if (!payload.analysis) return Response.json({ error: "Analysis results are required." }, { status: 400 });
          const draftConfig = await resolveAI(params.workflowId, "draft");
          const validationConfig = await resolveAI(params.workflowId, "validation");
          const draft = await callGemini(draftConfig, [
            `Create the response for workflow: ${workflow.title}.`,
            workflow.workflowPrompt,
            `Focus on: ${workflow.focusAreas.join(", ")}.`,
            "Use only supplied facts. Do not invent policy, law, facts, dates, amounts, diagnoses, deadlines, or outcomes.",
            "Write a professional response that a human can review and edit.",
            `CASE ANALYSIS:\n${JSON.stringify(payload.analysis)}`,
          ].join("\n\n"));
          const validation = await callGemini(validationConfig, [
            `Audit this draft for the workflow: ${workflow.title}.`,
            "Return strict JSON: {\"valid\":boolean,\"issues\":string[],\"unsupportedClaims\":string[],\"missingEvidence\":string[],\"suggestions\":string[] }.",
            "Flag unsupported claims, missing evidence, contradictions, deadline issues, fabricated authority, and factual uncertainty.",
            `ANALYSIS:\n${JSON.stringify(payload.analysis)}`,
            `DRAFT:\n${draft}`,
          ].join("\n\n"));
          return Response.json({ ok: true, workflowId: workflow.id, draft, validation, provider: "gemini", draftModel: draftConfig.model, validationModel: validationConfig.model });
        } catch (error) {
          return Response.json({ error: error instanceof Error ? error.message : "Unable to create response." }, { status: 502 });
        }
      },
    },
  },
});
