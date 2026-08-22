import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";
import { calculateAgencyDecisionTotal } from "@/domain/agency-decision-pricing";

export const Route = createFileRoute("/api/workflows/agency-decision/approve")({ server: { handlers: { POST: async ({ request }) => {
  try {
    const user = await requireAuthenticatedUser(request);
    const input = await request.json() as { appealId?: string; recipient?: { name?: string; address1?: string; address2?: string; city?: string; state?: string; zip?: string }; mailingMethod?: "standard" | "certified" | "registered"; responseSheets?: number; supportingSheets?: number; envelopeSurcharge?: boolean };
    if (!input.appealId?.trim()) return Response.json({ error: "Appeal id is required." }, { status: 400 });
    if (!input.recipient?.name || !input.recipient.address1 || !input.recipient.city || !input.recipient.state || !input.recipient.zip) return Response.json({ error: "A complete mailing recipient is required." }, { status: 400 });
    if (!input.mailingMethod) return Response.json({ error: "Mailing method is required." }, { status: 400 });
    const supabase = await getSupabaseServer();
    const { data: appeal, error } = await supabase.from("appeals").select("*").eq("id", input.appealId).single();
    if (error || !appeal) return Response.json({ error: "Appeal case not found." }, { status: 404 });
    if (appeal.user_id !== user.id) return Response.json({ error: "You do not own this appeal case." }, { status: 403 });
    if (appeal.workflow_id !== "agency-decision-appeal") return Response.json({ error: "Workflow mismatch." }, { status: 409 });
    if (!appeal.draft?.trim()) return Response.json({ error: "Draft is required before approval." }, { status: 409 });
    const decision = appeal.decision || {};
    const authority = Array.isArray(decision.authoritySources) ? decision.authoritySources : [];
    const unresolved = authority.filter((source: any) => source?.verificationState === "unverified" || source?.verificationState === "conflicting");
    const evidenceGaps = Array.isArray(decision.evidenceGaps) ? decision.evidenceGaps : [];
    const contradictions = Array.isArray(decision.contradictions) ? decision.contradictions : [];
    const review = { generatedAt: new Date().toISOString(), status: unresolved.length || evidenceGaps.length || contradictions.length ? "review_required" : "ready", authorityUnresolved: unresolved.length, evidenceGaps: evidenceGaps.length, contradictions: contradictions.length, checks: [{ name: "Decision identified", status: decision.id ? "pass" : "fail" }, { name: "Procedural authority", status: unresolved.length ? "warn" : "pass" }, { name: "Evidence gaps surfaced", status: "pass" }, { name: "Contradictions surfaced", status: "pass" }, { name: "Human approval required", status: "pass" }] };
    if (review.status !== "ready") return Response.json({ error: "Appeal still has unresolved authority or evidence issues. Resolve or explicitly acknowledge them before payment.", review }, { status: 409 });
    const responseSheets = Math.max(1, Math.floor(input.responseSheets ?? 3));
    const supportingSheets = Math.max(0, Math.floor(input.supportingSheets ?? 0));
    const pricing = calculateAgencyDecisionTotal({ responseSheets, supportingSheets, mailingMethod: input.mailingMethod, envelopeSurcharge: Boolean(input.envelopeSurcharge) });
    const packet = { appealId: appeal.id, workflowId: "agency-decision-appeal", finalResponse: appeal.draft, recipient: input.recipient, mailingMethod: input.mailingMethod, generatedAt: new Date().toISOString(), sourceDecisionId: decision.id, authoritySources: authority, deterministic: true, responseSheets, supportingSheets, pricing };
    const version = appeal.version ?? 1;
    const { error: updateError } = await supabase.from("appeals").update({ status: "ready", review, packet, version: version + 1, updated_at: new Date().toISOString() }).eq("id", appeal.id).eq("user_id", user.id).eq("version", version);
    if (updateError) throw new Error(`Unable to approve appeal: ${updateError.message}`);
    return Response.json({ ok: true, status: "ready", review, packet, pricing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to approve appeal.";
    const status = /authentication|required|token/i.test(message) ? 401 : 502;
    return Response.json({ error: message }, { status });
  }
} } } });
