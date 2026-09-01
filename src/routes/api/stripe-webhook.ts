import { createFileRoute } from "@tanstack/react-router";
import { idempotencyStore, webhookKey, attestDocument } from "@/platform/runtime";
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
        try {
          event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
        } catch (err) {
          return Response.json({ error: `Webhook signature verification failed: ${(err as Error).message}` }, { status: 400 });
        }

        const eventKey = webhookKey(event.id);
        const claimed = await idempotencyStore.reserve(eventKey);
        if (!claimed) return Response.json({ received: true, deduplicated: true }, { status: 200 });

        const { createClient } = await import("@supabase/supabase-js");
        try {
          if (event.type === "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const appealId = session.metadata?.appeal_id;
            const workflowId = session.metadata?.workflow_id || "unknown";
            const mailingMethod = (session.metadata?.mailing_method || "standard") as "standard" | "certified" | "registered";
            const recipientName = session.metadata?.recipient_name || "";

            const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            if (!supabaseUrl || !serviceKey || !appealId) throw new Error("Payment fulfillment storage is not configured or appeal id is missing.");
            const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

            const { data: appeal, error: appealError } = await supabase
              .from("appeals")
              .select("*")
              .eq("id", appealId)
              .single();
            if (appealError || !appeal) throw new Error(`Unable to load paid appeal ${appealId}: ${appealError?.message || "not found"}`);

            const packet = (appeal.packet || {}) as Record<string, any>;
            if (!packet.locked || !packet.documentId || packet.status !== "assembled") {
              throw new Error("Paid appeal does not have a locked, user-confirmed final packet. No mailing was submitted.");
            }
            if (!appeal.draft?.trim() || !packet.finalDraftHash) throw new Error("Paid appeal is missing a final draft hash.");
            const currentDraftHash = await computeHash(appeal.draft);
            if (currentDraftHash !== packet.finalDraftHash) throw new Error("Final draft changed after packet assembly. Rebuild and re-confirm the packet before mailing.");
            if (!packet.documentSha256) throw new Error("Locked packet is missing its document integrity hash.");

            const recipient = {
              name: packet.recipientName || recipientName,
              address1: packet.recipientAddress1,
              address2: packet.recipientAddress2,
              city: packet.recipientCity,
              state: packet.recipientState,
              postalCode: packet.recipientZip,
            };
            if (!recipient.name || !recipient.address1 || !recipient.city || !recipient.state || !recipient.postalCode) {
              throw new Error("Paid appeal has no complete packet recipient.");
            }

            await supabase.from("mailings").insert({
              appeal_id: appealId,
              status: "paid",
              mailing_method: mailingMethod,
              recipient,
              stripe_session_id: session.id,
              stripe_payment_id: session.payment_intent as string,
            });

            const provider = await mailMyPDFProvider.createLetter({
              workflowId,
              documentId: packet.documentId,
              recipient,
              method: mailingMethod,
              stripePaymentId: session.payment_intent as string,
              idempotencyKey: `stripe:${session.id}:appeal:${appealId}:packet:${packet.id}`,
              matterReference: appeal.decision?.referenceNumber || appealId,
              matterType: workflowId,
            });
            const providerStatus = await mailMyPDFProvider.getStatus(provider.providerOrderId);
            const now = new Date().toISOString();
            const proof = createProofPacket({
              appealId,
              packetId: packet.id,
              finalAppealHash: packet.finalDraftHash,
              attachmentHashes: Array.isArray(packet.attachmentHashes) ? packet.attachmentHashes : [],
              exhibitIndexHash: typeof packet.exhibitIndexHash === "string" ? packet.exhibitIndexHash : undefined,
              recipient: { name: recipient.name, address1: recipient.address1, city: recipient.city, state: recipient.state, zip: recipient.postalCode },
              mailingMethod,
              providerOrderId: provider.providerOrderId,
            });
            proof.mailingTimestamp = ["mailed", "in_transit", "delivered"].includes(providerStatus.state) ? now : undefined;
            proof.trackingNumber = providerStatus.trackingNumber;
            proof.status = providerStatus.state === "delivered" ? "delivered" : providerStatus.state === "in_transit" ? "in_transit" : providerStatus.state === "mailed" ? "mailed" : "assembled";
            proof.sealedAt = now;
            (proof as any).documentIntegrity = { sha256: packet.documentSha256, byteLength: packet.documentSizeBytes, contentType: "application/pdf", fileName: packet.documentFilename };

            const appealStatus = proof.status === "delivered" ? "delivered" : proof.status === "mailed" || proof.status === "in_transit" ? "mailed" : "ready";
            await supabase
              .from("appeals")
              .update({ status: appealStatus, proof, updated_at: now })
              .eq("id", appealId)
              .eq("user_id", appeal.user_id);
            await supabase
              .from("mailings")
              .update({ provider_order_id: provider.providerOrderId, status: providerStatus.state, tracking_number: providerStatus.trackingNumber, updated_at: now })
              .eq("appeal_id", appealId)
              .eq("stripe_session_id", session.id);

            console.log(`${workflowId} fulfilled: ${appealId} -> ${provider.providerOrderId} (${providerStatus.state})`);
          } else if (event.type === "payment_intent.payment_failed") {
            console.log(`Payment failed: ${(event.data.object as Stripe.PaymentIntent).id}`);
          } else if (event.type === "charge.refunded") {
            console.log(`Charge refunded: ${(event.data.object as Stripe.Charge).id}`);
          } else {
            console.log(`Unhandled Stripe event: ${event.type}`);
          }
          await idempotencyStore.store(eventKey, { processed: true });
          return Response.json({ received: true }, { status: 200 });
        } catch (err) {
          console.error("Post-payment processing failed:", err);
          return Response.json({ received: true, fulfillmentError: err instanceof Error ? err.message : "fulfillment failed" }, { status: 500 });
        }
      },
    },
  },
});
