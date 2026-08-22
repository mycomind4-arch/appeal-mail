import { createFileRoute } from "@tanstack/react-router";
import { computeHash, createProofPacket } from "@/domain/proof";
import { mailMyPDFProvider } from "@/platform/mailmypdf-provider";

export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { default: Stripe } = await import("stripe");
        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const signature = request.headers.get("stripe-signature");
        if (!stripeSecretKey || !webhookSecret) return Response.json({ error: "Stripe webhook is not configured." }, { status: 503 });
        if (!signature) return Response.json({ error: "Missing Stripe signature header." }, { status: 400 });

        const stripe = new Stripe(stripeSecretKey, { apiVersion: "2024-06-20" as Stripe.LatestApiVersion });
        const body = await request.text();
        let event: Stripe.Event;
        try { event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret); }
        catch (err) { return Response.json({ error: `Webhook signature verification failed: ${(err as Error).message}` }, { status: 400 }); }

        const { createClient } = await import("@supabase/supabase-js");
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const appealId = session.metadata?.appeal_id;
            const mailingMethod = session.metadata?.mailing_method || "standard";
            const recipientName = session.metadata?.recipient_name || "";
            const workflowId = session.metadata?.workflow_id || "unknown";

            try {
              const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
              const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
              if (!supabaseUrl || !serviceKey || !appealId) throw new Error("Payment fulfillment storage is not configured or appeal id is missing.");
              const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

              const { data: appeal, error: appealError } = await supabase.from("appeals").select("*").eq("id", appealId).single();
              if (appealError || !appeal) throw new Error(`Unable to load paid appeal ${appealId}: ${appealError?.message || "not found"}`);

              await supabase.from("mailings").insert({
                appeal_id: appealId,
                status: "paid",
                mailing_method: mailingMethod,
                recipient: { name: recipientName },
                stripe_session_id: session.id,
                stripe_payment_id: session.payment_intent as string,
              });

              if (workflowId === "government-decision") {
                const packet = appeal.packet as any;
                const evidence = Array.isArray(appeal.evidence) ? appeal.evidence : [];
                const sourceEvidence = evidence.find((item: any) => item.documentId);
                if (!sourceEvidence?.documentId) throw new Error("Government decision fulfillment has no source document id.");
                if (!packet?.recipientName || !packet.recipientAddress1 || !packet.recipientCity || !packet.recipientState || !packet.recipientZip) throw new Error("Government decision fulfillment has no complete packet recipient.");
                if (!appeal.draft?.trim()) throw new Error("Government decision fulfillment has no final response draft.");

                const provider = await mailMyPDFProvider.createLetter({
                  workflowId,
                  documentId: sourceEvidence.documentId,
                  recipient: {
                    name: packet.recipientName,
                    address1: packet.recipientAddress1,
                    address2: packet.recipientAddress2,
                    city: packet.recipientCity,
                    state: packet.recipientState,
                    postalCode: packet.recipientZip,
                  },
                  method: mailingMethod as "standard" | "certified" | "registered",
                  stripePaymentId: session.payment_intent as string,
                  idempotencyKey: `stripe:${session.id}:appeal:${appealId}`,
                  matterReference: appeal.decision?.referenceNumber || appealId,
                  matterType: "government-decision",
                });
                const providerStatus = await mailMyPDFProvider.getStatus(provider.providerOrderId);
                const now = new Date().toISOString();
                const finalAppealHash = await computeHash(appeal.draft);
                const proof = createProofPacket({
                  appealId,
                  packetId: packet.id,
                  finalAppealHash,
                  attachmentHashes: [],
                  recipient: { name: packet.recipientName, address1: packet.recipientAddress1, city: packet.recipientCity, state: packet.recipientState, zip: packet.recipientZip },
                  mailingMethod: mailingMethod as "standard" | "certified" | "registered",
                  providerOrderId: provider.providerOrderId,
                });
                proof.mailingTimestamp = providerStatus.state === "mailed" || providerStatus.state === "in_transit" || providerStatus.state === "delivered" ? now : undefined;
                proof.trackingNumber = providerStatus.trackingNumber;
                proof.status = providerStatus.state === "delivered" ? "delivered" : providerStatus.state === "in_transit" ? "in_transit" : providerStatus.state === "mailed" ? "mailed" : "assembled";
                proof.sealedAt = now;

                const appealStatus = proof.status === "delivered" ? "delivered" : proof.status === "mailed" || proof.status === "in_transit" ? "mailed" : "ready";
                await supabase.from("appeals").update({ status: appealStatus, proof, updated_at: now }).eq("id", appealId).eq("user_id", appeal.user_id);
                console.log(`Government decision fulfilled: ${appealId} -> ${provider.providerOrderId} (${providerStatus.state})`);
              } else {
                await supabase.from("appeals").update({ status: "ready", updated_at: new Date().toISOString() }).eq("id", appealId);
                console.log(`Payment completed for appeal ${appealId}: ${mailingMethod} to ${recipientName}`);
              }
            } catch (err) {
              console.error("Post-payment processing failed:", err);
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
        return Response.json({ received: true }, { status: 200 });
      },
    },
  },
});
