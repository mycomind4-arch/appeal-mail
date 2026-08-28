import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";
import { uploadDocument } from "@/platform/mailmypdf";
import { callLLMDocument, callLLMText } from "@/platform/llm-bridge";

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

function asString(value: unknown): string { return typeof value === "string" ? value : ""; }

export const Route = createFileRoute("/api/workflows/denied-claim/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const user = await requireAuthenticatedUser(request);
          const form = await request.formData();
          const file = form.get("document");
          if (!(file instanceof File)) return Response.json({ error: "A source document is required." }, { status: 400 });
          if (file.size === 0) return Response.json({ error: "The source document is empty." }, { status: 400 });
          if (file.size > 20 * 1024 * 1024) return Response.json({ error: "Source documents must be 20 MB or smaller." }, { status: 413 });
          if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) return Response.json({ error: "Denied Claim currently accepts PDF, PNG, and JPEG source documents." }, { status: 415 });

          const provider = await resolveProvider("analysis");
          if (provider.provider !== "gemini") throw new Error("Denied Claim is currently configured for Gemini. Add another provider in the MailMyPDF admin control plane when ready.");

          const sourceDocument = await uploadDocument(file);
          const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
          const { text: text } = await callLLMDocument(gemini, mediaType(file), bytes, gemini.promptOverride || prompt);

          const analysis = JSON.parse(text) as Record<string, unknown>;
          const now = new Date().toISOString();
          const appealId = crypto.randomUUID();
          const decisionId = crypto.randomUUID();
          const keyFacts = Array.isArray(analysis.keyFacts) ? analysis.keyFacts : [];
          const denialReasons = Array.isArray(analysis.denialReasons) ? analysis.denialReasons : [];
          const issues = Array.isArray(analysis.issues) ? analysis.issues : [];
          const facts = keyFacts.map((fact, index) => ({ id: crypto.randomUUID(), label: typeof fact === "string" ? `Extracted fact ${index + 1}` : asString((fact as any)?.label) || `Extracted fact ${index + 1}`, value: typeof fact === "string" ? fact : asString((fact as any)?.value) || asString((fact as any)?.text), source: "extracted", confidence: 0.9 }));
          const reasons = denialReasons.map((reason) => ({ id: crypto.randomUUID(), text: asString(reason), confidence: 0.9 })).filter((reason) => reason.text.length > 0);
          const decisionIssues = issues.map((issue) => {
            const item = typeof issue === "string" ? { issue } : issue as any;
            return { id: crypto.randomUUID(), description: asString(item.issue) || asString(item.description), type: "factual_dispute", severity: "medium", sourceExcerpt: asString(item.whyItMatters) };
          }).filter((issue) => issue.description.length > 0);
          const deadlineValue = asString(analysis.deadline);
          const deadline = deadlineValue ? { date: deadlineValue, type: "appeal", source: "extracted", appealInstructions: asString(analysis.appealInstructions) } : undefined;
          const decision = {
            id: decisionId,
            type: "claim_denial",
            documentId: sourceDocument.id,
            documentFilename: file.name,
            agency: asString(analysis.issuer),
            referenceNumber: asString(analysis.referenceNumber),
            decisionDate: asString(analysis.decisionDate),
            deadline,
            facts,
            reasons,
            citedRules: [],
            appealInstructions: asString(analysis.appealInstructions),
            chronology: [],
            issues: decisionIssues,
            extractedAt: now,
            extractionConfidence: analysis.confidence === "high" ? 0.9 : analysis.confidence === "medium" ? 0.7 : 0.5,
            rawText: JSON.stringify(analysis),
          };

          const supabase = await getSupabaseServer();
          const { error: insertError } = await supabase.from("appeals").insert({
            id: appealId,
            user_id: user.id,
            workflow_id: "denied-claim",
            status: "in_progress",
            decision,
            grounds: [],
            evidence: [{ id: crypto.randomUUID(), type: "document", label: file.name, documentId: sourceDocument.id, documentFilename: file.name, groundIds: [], uploadedAt: now }],
            arguments: [],
            draft: "",
            review: null,
            packet: null,
            proof: null,
            timeline: [],
            version: 1,
            created_at: now,
            updated_at: now,
          });
          if (insertError) throw new Error(`Unable to save appeal: ${insertError.message}`);

          return Response.json({ ok: true, workflowId: "denied-claim", appealId, documentId: sourceDocument.id, fileName: file.name, extracted: analysis, analysis: { analysisText: asString(analysis.summary), structured: analysis }, provider: "gemini", model: provider.model });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to analyze document.";
          const status = /authentication|required|token/i.test(message) ? 401 : 502;
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
