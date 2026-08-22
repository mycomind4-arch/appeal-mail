import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";

export const Route = createFileRoute("/api/workflows/agency-decision/checkout")({ server: { handlers: { POST: async ({ request }) => {
  try {
    const user = await requireAuthenticatedUser(request);
    const input = await request.json() as { appealId?: string };
    if (!input.appealId?.trim()) return Response.json({ error: "Appeal id is required." }, { status: 400 });
    const supabase = await getSupabaseServer();
    const { data: appeal, error } = await supabase.from("appeals").select("*").eq("id", input.appealId).single();
    if (error || !appeal) return Response.json({ error: "Appeal case not found." }, { status: 404 });
    if (appeal.user_id !== user.id) return Response.json({ error: "You do not own this appeal case." }, { status: 403 });
    if (appeal.workflow_id !== "agency-decision-appeal") return Response.json({ error: "Workflow mismatch." }, { status: 409 });
    if (appeal.status !== "ready" || !appeal.review || !appeal.packet?.pricing) return Response.json({ error: "Appeal is not approved and priced for payment." }, { status: 409 });
    const { default: Stripe } = await import("stripe");
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) return Response.json({ error: "Stripe is not configured." }, { status: 503 });
    const stripe = new Stripe(secretKey, { apiVersion: "2024-06-20" as Stripe.LatestApiVersion });
    const appUrl = process.env.APP_URL || "https://appeal-mail.pages.dev";
    const pricing = appeal.packet.pricing;
    const session = await stripe.checkout.sessions.create({ mode: "payment", payment_method_types: ["card"], line_items: [{ price_data: { currency: "usd", product_data: { name: "Agency Decision Appeal Packet", description: `Preparation + ${pricing.responseSheets} response sheets + ${pricing.supportingSheets} supporting sheets + ${appeal.packet.mailingMethod} mailing` }, unit_amount: Math.round(Number(pricing.total) * 100) }, quantity: 1 }], metadata: { appeal_id: appeal.id, workflow_id: "agency-decision-appeal", mailing_method: appeal.packet.mailingMethod, owner_user_id: user.id, packet_total: String(pricing.total), response_sheets: String(pricing.responseSheets), supporting_sheets: String(pricing.supportingSheets) }, success_url: `${appUrl}/workflows/agency-decision?checkout=success&session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${appUrl}/workflows/agency-decision?checkout=cancelled` });
    return Response.json({ ok: true, sessionId: session.id, url: session.url, pricing });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session.";
    return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 502 });
  }
} } } });
