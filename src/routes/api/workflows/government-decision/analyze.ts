import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";
import { uploadDocument } from "@/platform/mailmypdf";
import { createDecision } from "@/domain/decision";
import { createAppeal } from "@/domain/appeal";
import { createGround } from "@/domain/ground";
import { createEvidence } from "@/domain/evidence";
import { getWorkflow } from "@/domain/workflows";
import { GOVERNMENT_DECISION_AUTHORITY_DISCLAIMER } from "@/domain/government-decision-authority";

function mediaType(file: File): "application/pdf" | "image/png" | "image/jpeg" {
  if (file.type === "application/pdf" || file.type === "image/png" || file.type === "image/jpeg") return file.type;
  throw new Error("Please upload a PDF, PNG, or JPEG document.");
}

async function resolveGemini() {
  const base = process.env.MAILMYPDF_CONTROL_PLANE_URL || "https://mailmypdf.com";
  const token = process.env.MAILMYPDF_CONTROL_PLANE_TOKEN;
  if (!token) throw new Error("MailMyPDF control-plane token is not configured.");
  const r = await fetch(`${base.replace(/\/$/, "")}/api/control-plane/ai`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
    body: JSON.stringify({ verticalSlug: "appeal-mail", workflowSlug: "government-decision", task: "analysis" }),
  });
  const p = await r.json().catch(() => null) as { provider?: string; apiKey?: string; model?: string; promptOverride?: string } | null;
  if (!r.ok || !p?.apiKey || !p.model || p.provider !== "gemini") throw new Error("Gemini configuration is unavailable for this workflow.");
  return p;
}

export const Route = createFileRoute("/api/workflows/government-decision/analyze")({
  server: { handlers: { POST: async ({ request }) => {
    try {
      const user = await requireAuthenticatedUser(request);
      const workflow = getWorkflow("government-decision");
      const form = await request.formData();
      const file = form.get("document");
      if (!(file instanceof File)) return Response.json({ error: "A government decision is required." }, { status: 400 });
      if (!file.size) return Response.json({ error: "The source document is empty." }, { status: 400 });
      if (file.size > 20 * 1024 * 1024) return Response.json({ error: "Source documents must be 20 MB or smaller." }, { status: 413 });
      if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) return Response.json({ error: "Please upload a PDF, PNG, or JPEG document." }, { status: 415 });

      const [document, gemini] = await Promise.all([uploadDocument(file), resolveGemini()]);
      const bytes = Buffer.from(await file.arrayBuffer()).toString("base64");
      const prompt = [
        `Workflow: ${workflow.title}`,
        workflow.description,
        workflow.workflowPrompt,
        `Focus areas: ${workflow.focusAreas.join(", ")}.`,
        GOVERNMENT_DECISION_AUTHORITY_DISCLAIMER,
        "Extract only facts supported by the uploaded document. Clearly distinguish agency findings, cited authority, user-disputed facts, and uncertainty.",
        "Never invent a jurisdiction, agency rule, form, filing destination, appeal period, exhaustion requirement, legal standard, or outcome.",
        "For dates, preserve the exact date plus what event the date represents: decision, effective, service, receipt, or deadline.",
        "For appeal path, quote or closely preserve the filing destination and method only when the document supplies it; otherwise mark it unresolved.",
        "Build an issue-to-evidence map and explicitly identify missing evidence instead of filling gaps.",
        "Return strict JSON only with no markdown.",
        '{"summary":"","decision":"","decisionType":"government_decision","issuer":"","programOrAuthority":"","jurisdiction":"","referenceNumber":"","decisionDate":"","effectiveDate":"","receiptDate":"","deadline":"","deadlineBasis":"","appealPath":"","filingMethod":"","recipientOrAppealAuthority":"","hearingInstructions":"","proceduralRequirements":[],"citedAuthority":[],"reasons":[],"keyFindings":[],"evidenceMentioned":[],"issues":[{"issue":"","whyItMatters":"","evidenceNeeded":[]}],"uncertainties":[],"confidence":"high|medium|low","sourceCitations":[{"page":"","claim":""}]}'
      ].join("\n\n");
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(gemini.model)}:generateContent?key=${encodeURIComponent(gemini.apiKey)}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ inlineData: { mimeType: mediaType(file), data: bytes } }, { text: gemini.promptOverride || prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1 } }),
      });
      const body = await response.json().catch(() => null) as any;
      if (!response.ok) throw new Error(body?.error?.message || `Gemini analysis failed (${response.status}).`);
      const text = body?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
      if (!text) throw new Error("Gemini returned no analysis.");
      const analysis = JSON.parse(text) as any;

      const decision = createDecision("claim_denial", {
        id: crypto.randomUUID(), documentId: document.id, documentFilename: document.filename,
        agency: analysis.issuer || undefined, referenceNumber: analysis.referenceNumber || undefined,
        decisionDate: analysis.decisionDate || undefined, decisionTypeLabel: analysis.decision || "Government decision",
        deadline: analysis.deadline ? { date: analysis.deadline, type: "appeal", source: "extracted" } : undefined,
        facts: [...(analysis.keyFindings || [])].map((value: string, index: number) => ({ id: `${index}-${crypto.randomUUID()}`, label: `Finding ${index + 1}`, value, source: "extracted", confidence: analysis.confidence === "high" ? 0.9 : analysis.confidence === "medium" ? 0.75 : 0.55 })),
        reasons: (analysis.reasons || []).map((textValue: string, index: number) => ({ id: `${index}-${crypto.randomUUID()}`, text: textValue, confidence: 0.9 })),
        issues: (analysis.issues || []).map((issue: any, index: number) => ({ id: `${index}-${crypto.randomUUID()}`, description: issue.issue || "Government decision issue", type: "factual_dispute", severity: "medium", sourceExcerpt: issue.whyItMatters })),
        rawText: JSON.stringify(analysis), extractedAt: new Date().toISOString(), extractionConfidence: analysis.confidence === "high" ? 0.9 : analysis.confidence === "medium" ? 0.7 : 0.5,
      });
      const grounds = (analysis.issues || []).map((issue: any, index: number) => createGround("factual_error", { id: `ground-${index}-${crypto.randomUUID()}`, claim: issue.issue || "Review a stated government finding", source: issue.whyItMatters || "Identified by document analysis", confidence: 0.65, unresolvedIssue: (issue.evidenceNeeded || []).join(", ") }));
      const evidence = (analysis.evidenceMentioned || []).map((label: string) => createEvidence("document", label, { documentId: document.id, documentFilename: document.filename, uploadedAt: new Date().toISOString() }));
      evidence.unshift(createEvidence("document", "Original government decision", { documentId: document.id, documentFilename: document.filename, uploadedAt: new Date().toISOString() }));
      if (evidence.length && grounds.length) for (const ground of grounds) ground.supportingEvidenceIds = evidence.map((item) => item.id);

      const appeal = createAppeal("government-decision", decision);
      appeal.grounds = grounds; appeal.evidence = evidence; appeal.updatedAt = new Date().toISOString();
      const supabase = await getSupabaseServer();
      const { error } = await supabase.from("appeals").insert({ id: appeal.id, user_id: user.id, workflow_id: appeal.workflowId, status: appeal.status, decision: appeal.decision, grounds: appeal.grounds, evidence: appeal.evidence, arguments: appeal.arguments, draft: appeal.draft, review: null, packet: null, proof: null, timeline: appeal.timeline, version: 1, created_at: appeal.createdAt, updated_at: appeal.updatedAt });
      if (error) throw new Error(`Unable to persist appeal case: ${error.message}`);
      return Response.json({ ok: true, appealId: appeal.id, workflowId: appeal.workflowId, workflow: { title: workflow.title, primaryKeyword: "administrative appeal" }, document, analysis, provider: "gemini", model: gemini.model });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to analyze government decision.";
      return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 502 });
    }
  } } },
});
