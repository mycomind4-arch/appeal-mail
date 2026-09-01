import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseServer } from "@/platform/supabase";
import { requireUser } from "@/lib/auth-guard";

export const Route = createFileRoute("/api/dashboard/mailings")({ server: { handlers: { GET: async ({ request }) => {
  try {
    const user = await requireUser(request);
    const supabase = await getSupabaseServer();
    const { data, error } = await supabase.from("mailings").select("id,appeal_id,status,provider_order_id,tracking_number,mailing_method,recipient,stripe_session_id,stripe_payment_id,created_at,updated_at,appeals!inner(user_id,workflow_id)").eq("appeals.user_id", user.id).order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return Response.json({ ok: true, mailings: data || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load mailings.";
    return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 500 });
  }
} } });
