import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";

export const Route = createFileRoute("/api/workflows/agency-decision/draft")({ server: { handlers: { POST: async ({ request }) => {
  try {
    const user = await requireAuthenticatedUser(request);
    const input = await request.json() as { appealId?: string; additionalFacts?: string };
    if (!input.appealId?.trim()) return Response.json({ error: "Appeal id is required." }, { status: 400 });
    const supabase = await getSupabaseServer();
    const { data: appeal, error } = await supabase.from("appeals").select("*").eq("id", input.appealId).single();
    if (error || !appeal) return Response.json({ error: "Appeal case not found." }, { status: 404 });
    if (appeal.user_id !== user.id) return Response.json({ error: "You do not own this appeal case." }, { status: 403 });
    if (appeal.workflow_id !== "agency-decision-appeal") return Response.json({ error: "Workflow mismatch." }, { status: 409 });
    const decision = appeal.decision || {};
    const authority = Array.isArray(decision.authoritySources) ? decision.authoritySources : [];
    const facts = Array.isArray(decision.disputedFacts) ? decision.disputedFacts : [];
    const gaps = Array.isArray(decision.evidenceGaps) ? decision.evidenceGaps : [];
    const unresolved = Array.isArray(decision.uncertainties) ? decision.uncertainties : [];
    const providerBase = process.env.MAILMYPDF_CONTROL_PLANE_URL || "https://mailmypdf.com";
    const token = process.env.MAILMYPDF_CONTROL_PLANE_TOKEN;
    if (!token) throw new Error("MailMyPDF control-plane token is not configured.");
    const configResponse = await fetch(`${providerBase.replace(/\/$/, "")}/api/control-plane/ai`, { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${token}` }, body: JSON.stringify({ verticalSlug: "appeal-mail", workflowSlug: "agency-decision-appeal", task: "draft" }) });
    const config = await configResponse.json() as any;
    if (!configResponse.ok) throw new Error(config?.error || "Unable to resolve drafting provider.");
    if (config.provider !== "gemini") throw new Error("Agency Decision Appeal drafting is currently configured for Gemini.");
    const prompt = config.promptOverride || [
      "Draft a formal agency-decision appeal response from the supplied structured record.",
      "Use only supported facts. Do not invent procedural rules, deadlines, authorities, addresses, evidence, or legal conclusions.",
      "When a procedural item is unresolved, phrase it as a request for confirmation or leave it out rather than guessing.",
      "The result must be a professional letter with recipient placeholder fields, subject, concise factual statement, numbered grounds tied to evidence, requested action, and a verification note for unresolved procedural items.",
      JSON.stringify({ decision, authority, disputedFacts: facts, evidenceGaps: gaps, uncertainties: unresolved, additionalFacts: input.additionalFacts || "" }),
    ].join("\n\n");
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(config.model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { temperature: 0.2 } }) });
    const body = await aiResponse.json().catch(() => null) as any;
    if (!aiResponse.ok) throw new Error(body?.error?.message || "Draft generation failed.");
    const draft = body?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
    if (!draft) throw new Error("Draft generation returned no text.");
    const currentVersion = appeal.version ?? 1;
    const { error: updateError } = await supabase.from("appeals").update({ draft, status: "drafted", version: currentVersion + 1, updated_at: new Date().toISOString() }).eq("id", appeal.id).eq("user_id", user.id).eq("version", currentVersion);
    if (updateError) throw new Error(`Unable to save draft: ${updateError.message}`);
    return Response.json({ ok: true, appealId: appeal.id, draft, status: "drafted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to draft appeal.";
    const status = /authentication|required|token/i.test(message) ? 401 : 502;
    return Response.json({ error: message }, { status });
  }
} } } });
