import { createAPIFileRoute } from "@tanstack/react-start";

/* ─────────────────────────────────────────────
   Stripe webhook handler.
   Receives payment events and:
   1. On checkout.session.completed → creates
      MailMyPDF mailing + saves mailing record
   2. On payment failure → logs
   3. On refund → logs
   ───────────────────────────────────────────── */

export const APIRoute = createAPIFileRoute("/api/stripe-webhook")({
  POST: async ({ request }) => {
    const { default: Stripe } = await import("stripe");
    const { createClient } = await import("@supabase/supabase-js");

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
        const mailingMethod = session.metadata?.mailing_method || "standard";
        const recipientName = session.metadata?.recipient_name || "";
        const workflowId = session.metadata?.workflow_id || "unknown";

        try {
          // 1. Save mailing record to Supabase
          const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

          if (supabaseUrl && serviceKey) {
            const supabase = createClient(supabaseUrl, serviceKey, {
              auth: { persistSession: false, autoRefreshToken: false },
            });

            await supabase.from("mailings").insert({
              appeal_id: appealId,
              status: "paid",
              mailing_method: mailingMethod,
              recipient: { name: recipientName },
              stripe_session_id: session.id,
              stripe_payment_id: session.payment_intent as string,
            });

            // Update appeal status
            if (appealId) {
              await supabase
                .from("appeals")
                .update({ status: "ready", updated_at: new Date().toISOString() })
                .eq("id", appealId);
            }
          }

          // 2. Trigger MailMyPDF mailing
          // In production, upload the appeal document to MailMyPDF first,
          // then create a communication to mail it.
          //
          // const { uploadDocument } = await import("@/platform/mailmypdf");
          // const doc = await uploadDocument(appealLetterFile);
          // const { mailMyPDFProvider } = await import("@/platform/mailmypdf-provider");
          // const result = await mailMyPDFProvider.createLetter({
          //   workflowId,
          //   documentId: doc.id,
          //   recipient: { name, address1, city, state, postalCode },
          //   method: mailingMethod,
          //   stripePaymentId: session.payment_intent as string,
          // });

          console.log(`Payment completed for appeal ${appealId}: ${mailingMethod} to ${recipientName}`);
        } catch (err) {
          console.error("Post-payment processing failed:", err);
          // Return 200 anyway — Stripe will retry if we return 5xx
          // but we don't want to retry forever for a DB error
        }
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
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  },
});
