import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";
import { runReadinessReview } from "@/domain/review";

export const Route = createFileRoute("/api/workflows/insurance-claim-denial/approve")({
  server: { handlers: { POST: async ({ request }) => {
    try {
      const user = await requireAuthenticatedUser(request);
      const input = await request.json() as {
        appealId?: string;
        draft?: string;
        recipient?: { name?: string; address1?: string; address2?: string; city?: string; state?: string; zip?: string };
        mailingMethod?: "standard" | "certified" | "registered";
      };
      const appealId = input.appealId?.trim();
      if (!appealId) return Response.json({ error: "Appeal id is required." }, { status: 400 });
      const recipient = input.recipient;
      if (!recipient?.name || !recipient.address1 || !recipient.city || !recipient.state || !recipient.zip) return Response.json({ error: "A complete mailing recipient is required." }, { status: 400 });
      if (!input.mailingMethod) return Response.json({ error: "Mailing method is required." }, { status: 400 });

      const supabase = await getSupabaseServer();
      const { data: appeal, error } = await supabase.from("appeals").select("*").eq("id", appealId).single();
      if (error || !appeal) return Response.json({ error: "Appeal case not found." }, { status: 404 });
      if (appeal.user_id !== user.id) return Response.json({ error: "You do not own this appeal case." }, { status: 403 });
      if (appeal.workflow_id !== "insurance-claim-denial") return Response.json({ error: "Appeal workflow mismatch." }, { status: 409 });

      const packet = appeal.packet as Record<string, unknown> | null;
      if (!packet?.locked || packet.confirmedByUserId !== user.id || typeof packet.documentId !== "string" || !packet.documentId) {
        return Response.json({ error: "Build and lock the final packet before approval." }, { status: 409 });
      }
      const existingHash = typeof packet.finalDraftHash === "string" ? packet.finalDraftHash : "";
      const draft = input.draft?.trim() || appeal.draft?.trim();
      if (!draft) return Response.json({ error: "The appeal draft must be created before approval." }, { status: 409 });
      if (input.draft?.trim() && input.draft.trim() !== appeal.draft) return Response.json({ error: "The draft changed after packet assembly. Rebuild and lock the packet again before approval." }, { status: 409 });
      if (!existingHash) return Response.json({ error: "The final packet is missing its integrity hash." }, { status: 409 });

      // The mailing destination is part of the user-confirmed fulfillment contract.
      // Older packets may predate recipient persistence, so approval may seal the
      // destination metadata exactly once; a conflicting destination is rejected.
      const packetRecipient = {
        name: typeof packet.recipientName === "string" ? packet.recipientName : "",
        address1: typeof packet.recipientAddress1 === "string" ? packet.recipientAddress1 : "",
        address2: typeof packet.recipientAddress2 === "string" ? packet.recipientAddress2 : "",
        city: typeof packet.recipientCity === "string" ? packet.recipientCity : "",
        state: typeof packet.recipientState === "string" ? packet.recipientState : "",
        zip: typeof packet.recipientZip === "string" ? packet.recipientZip : "",
      };
      const hasPacketRecipient = Boolean(packetRecipient.name && packetRecipient.address1 && packetRecipient.city && packetRecipient.state && packetRecipient.zip);
      if (hasPacketRecipient) {
        const sameRecipient = packetRecipient.name === recipient.name &&
          packetRecipient.address1 === recipient.address1 &&
          packetRecipient.address2 === (recipient.address2 || "") &&
          packetRecipient.city === recipient.city &&
          packetRecipient.state === recipient.state &&
          packetRecipient.zip === recipient.zip;
        if (!sameRecipient) return Response.json({ error: "The mailing recipient changed after packet assembly. Rebuild and lock the packet again before approval." }, { status: 409 });
      }

      const evidence = Array.isArray(appeal.evidence) ? appeal.evidence : [];
      const grounds = Array.isArray(appeal.grounds) ? appeal.grounds : [];
      const review = runReadinessReview({
        decision: appeal.decision, grounds, evidence, draft,
        recipient: { name: recipient.name, address1: recipient.address1, address2: recipient.address2, city: recipient.city, state: recipient.state, zip: recipient.zip },
        exhibitCount: Number(packet.pageCount || 0),
        hasSignature: /sincerely[,\s]*$/im.test(draft) || /\[your name\]/i.test(draft),
      });
      if (review.score < 80 || review.issuesRequiringAttention > 2 || review.checks.some((check) => check.status === "fail")) return Response.json({ error: "Appeal is not ready for approval.", review }, { status: 409 });

      const sealedPacket = {
        ...packet,
        recipientName: recipient.name,
        recipientAddress1: recipient.address1,
        recipientAddress2: recipient.address2 || "",
        recipientCity: recipient.city,
        recipientState: recipient.state,
        recipientZip: recipient.zip,
        recipientConfirmedAt: typeof packet.recipientConfirmedAt === "string" ? packet.recipientConfirmedAt : new Date().toISOString(),
        recipientConfirmedByUserId: user.id,
        mailingMethod: input.mailingMethod,
      };
      const currentVersion = appeal.version ?? 1;
      const { error: updateError } = await supabase.from("appeals").update({ status: "ready", review, packet: sealedPacket, version: currentVersion + 1, updated_at: new Date().toISOString() }).eq("id", appealId).eq("user_id", user.id).eq("version", currentVersion);
      if (updateError) throw new Error(`Unable to approve appeal: ${updateError.message}`);
      return Response.json({ ok: true, appealId, status: "ready", review, packet: sealedPacket });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to approve appeal.";
      return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 502 });
    }
  } } });
