import { createAPIFileRoute } from "@tanstack/react-start";
import Stripe from "stripe";

/* ─────────────────────────────────────────────
   Stripe webhook handler.
   Receives payment events and updates
   mailing/proof status.
   ───────────────────────────────────────────── */

export const APIRoute = createAPIFileRoute("/api/stripe-webhook")({
  POST: async ({ request }) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2024-06-20" as Stripe.LatestApiVersion,
    });

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers.get("stripe-signature");

    if (!signature || !webhookSecret) {
      return new Response(JSON.stringify({ error: "Missing signature or webhook secret" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await request.text();

    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } catch (err) {
      return new Response(JSON.stringify({ error: `Webhook signature verification failed: ${(err as Error).message}` }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const appealId = session.metadata?.appeal_id;
        const mailingMethod = session.metadata?.mailing_method;
        const recipientName = session.metadata?.recipient_name;

        // In production: update the appeal record in Supabase
        // and trigger the MailMyPDF mailing
        console.log(`Payment completed for appeal ${appealId}: ${mailingMethod} to ${recipientName}`);

        // TODO: Call MailMyPDF to create the mailing
        // TODO: Update proof packet with payment confirmation
        // TODO: Store transaction record

        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${paymentIntent.id}`);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge refunded: ${charge.id}`);
        break;
      }

      default:
        // Unhandled event type — log for monitoring
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});
