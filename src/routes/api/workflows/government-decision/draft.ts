import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";
import { getWorkflow } from "@/domain/workflows";
import { GOVERNMENT_DECISION_AUTHORITY_DISCLAIMER } from "@/domain/government-decision-authority";

async function resolveGemini(task: "draft" | "validation") {
  const base = process.env.MAILMYPDF_CONTROL_PLANE_URL || "https://mailmypdf.com";
  const token = process.env.MAILMYPDF_CONTROL_PLANE_TOKEN;
  if (!token) throw new Error("MailMyPDF control-plane token is not configured.");
  const r = await fetch(`${base.replace(/\/$/, "")}/api/control-plane/ai`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ verticalSlug: "appeal-mail", workflowSlug: "government-decision", task }) });
  const p = await r.json().catch(() => null) as any;
  if (!r.ok || !p?.apiKey || !p.model || p.provider !== "gemini") throw new Error("Gemini configuration is unavailable for this workflow.");
  return p;
}

async function callGemini(config: any, prompt: string) {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: config.promptOverride || prompt }] }], generationConfig: { temperature: 0.2 } }) });
  const body = await response.json().catch(() => null) as any;
  if (!response.ok) throw new Error(body?.error?.message || `Gemini request failed (${response.status}).`);
  const text = body?.candidates?.[0]?.content?.parts?.map((part: any) => part.text || "").join("").trim();
  if (!text) throw new Error("Gemini returned no response.");
  return text;
}

export const Route = createFileRoute("/api/workflows/government-decision/draft")({ server: { handlers: { POST: async ({ request }) => {
  try {
    const user = await requireAuthenticatedUser(request);
    const input = await request.json() as { appealId?: string; analysis?: unknown; draftOverride?: string };
    if (!input.appealId?.trim()) return Response.json({ error: "Appeal id is required." }, { status: 400 });
    const supabase = await getSupabaseServer();
    const { data: appeal, error } = await supabase.from("appeals").select("*").eq("id", input.appealId).single();
    if (error || !appeal) return Response.json({ error: "Appeal case not found." }, { status: 404 });
    if (appeal.user_id !== user.id) return Response.json({ error: "You do not own this appeal case." }, { status: 403 });
    if (appeal.workflow_id !== "government-decision") return Response.json({ error: "Appeal workflow mismatch." }, { status: 409 });

    const workflow = getWorkflow("government-decision");
    const analysis = input.analysis || appeal.decision;
    const draftConfig = await resolveGemini("draft");
    const validationConfig = await resolveGemini("validation");

    const draft = input.draftOverride?.trim() || await callGemini(draftConfig, [
      `Create a review-ready administrative appeal response for: ${workflow.title}.`,
      workflow.workflowPrompt,
      GOVERNMENT_DECISION_AUTHORITY_DISCLAIMER,
      "Use only the supplied facts and source citations. Do not manufacture law, regulations, agency policy, procedural rights, filing instructions, deadlines, or outcomes.",
      "Do not describe an agency determination as erroneous unless the supplied record identifies the disputed fact, missing evidence, or applicable authority supporting that position.",
      "Include: recipient and reference, decision identification, requested action, point-by-point response to stated findings/reasons, evidence references, procedural compliance, and a human signature/contact block.",
      "When the correct appeal authority or deadline is unresolved, state that it requires verification instead of guessing.",
      `CASE ANALYSIS:\n${JSON.stringify(analysis)}`,
    ].join("\n\n"));

    const validation = await callGemini(validationConfig, [
      `Audit this ${workflow.title} draft against the supplied case analysis.`,
      "Return strict JSON only: {valid:boolean, issues:string[], unsupportedClaims:string[], missingEvidence:string[], deadlineIssues:string[], filingInstructionIssues:string[], sourceConflicts:string[], suggestions:string[]}.",
      "Flag every unsupported factual claim, invented law or agency procedure, unverified deadline, incorrect recipient/filing method, missing evidence reference, contradiction, or overstatement of outcome.",
      "Treat the decision notice and verified current official sources as controlling over generic background material.",
      `CASE ANALYSIS:\n${JSON.stringify(analysis)}`,
      `DRAFT:\n${draft}`,
    ].join("\n\n"));

    const persisted = `${draft}\n\nSincerely,\n[Your Name]`;
    const version = appeal.version ?? 1;
    const { error: updateError } = await supabase.from("appeals").update({ draft: persisted, status: "in_progress", version: version + 1, updated_at: new Date().toISOString() }).eq("id", appeal.id).eq("user_id", user.id).eq("version", version);
    if (updateError) throw new Error(`Unable to persist draft: ${updateError.message}`);
    return Response.json({ ok: true, appealId: appeal.id, draft: persisted, validation, provider: "gemini", draftModel: draftConfig.model, validationModel: validationConfig.model });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create government response.";
    return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 502 });
  }
} } } });
