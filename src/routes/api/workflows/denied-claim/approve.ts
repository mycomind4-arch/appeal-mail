import { createFileRoute } from "@tanstack/react-router";
import { requireAuthenticatedUser, getSupabaseServer } from "@/platform/supabase";
import { runReadinessReview } from "@/domain/review";
import { assemblePacket } from "@/domain/packet";
import { INSURANCE_CLAIM_APPEAL_PRICING } from "@/domain/insurance-claim-appeal-gold";

export const Route = createFileRoute("/api/workflows/denied-claim/approve")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const user = await requireAuthenticatedUser(request);
          const input = await request.json() as {
            appealId?: string;
            recipient?: { name?: string; address1?: string; address2?: string; city?: string; state?: string; zip?: string };
            mailingMethod?: "standard" | "certified" | "registered";
            responseSheets?: number;
            supportingSheets?: number;
          };
          const appealId = input.appealId?.trim();
          const recipient = input.recipient;
          const mailingMethod = input.mailingMethod;
          if (!appealId) return Response.json({ error: "Appeal id is required." }, { status: 400 });
          if (!recipient?.name || !recipient.address1 || !recipient.city || !recipient.state || !recipient.zip) return Response.json({ error: "A complete mailing recipient is required." }, { status: 400 });
          if (!mailingMethod) return Response.json({ error: "Mailing method is required." }, { status: 400 });

          const responseSheets = Math.max(1, Number(input.responseSheets ?? INSURANCE_CLAIM_APPEAL_PRICING.includedResponsePages));
          const supportingSheets = Math.max(0, Number(input.supportingSheets ?? 0));
          if (!Number.isFinite(responseSheets) || !Number.isFinite(supportingSheets)) return Response.json({ error: "Invalid packet sheet counts." }, { status: 400 });

          const supabase = await getSupabaseServer();
          const { data: appeal, error: loadError } = await supabase.from("appeals").select("*").eq("id", appealId).single();
          if (loadError || !appeal) return Response.json({ error: "Appeal case not found." }, { status: 404 });
          if (appeal.user_id !== user.id) return Response.json({ error: "You do not own this appeal case." }, { status: 403 });
          if (appeal.workflow_id !== "denied-claim") return Response.json({ error: "Appeal workflow mismatch." }, { status: 409 });
          if (!appeal.draft?.trim()) return Response.json({ error: "The appeal draft must be created before approval." }, { status: 409 });

          const evidence = Array.isArray(appeal.evidence) ? appeal.evidence : [];
          const grounds = Array.isArray(appeal.grounds) ? appeal.grounds : [];
          const review = runReadinessReview({ decision: appeal.decision, grounds, evidence, draft: appeal.draft, recipient: { name: recipient.name, address1: recipient.address1, address2: recipient.address2, city: recipient.city, state: recipient.state, zip: recipient.zip }, exhibitCount: evidence.length, hasSignature: /sincerely[,\s]*$/im.test(appeal.draft) || /\[your name\]/i.test(appeal.draft) });
          if (review.score < 80 || review.issuesRequiringAttention > 2 || review.checks.some(check => check.status === "fail")) return Response.json({ error: "Appeal is not ready for approval.", review }, { status: 409 });

          const packet = assemblePacket({ appealId, finalLetter: appeal.draft, evidence, recipient: { name: recipient.name, address1: recipient.address1, address2: recipient.address2, city: recipient.city, state: recipient.state, zip: recipient.zip }, mailingMethod });
          const responsePrinting = Math.max(0, responseSheets - INSURANCE_CLAIM_APPEAL_PRICING.includedResponsePages) * INSURANCE_CLAIM_APPEAL_PRICING.responsePagePrice;
          const supportingPrinting = supportingSheets * INSURANCE_CLAIM_APPEAL_PRICING.supportingPagePrice;
          const mailing = mailingMethod === "standard" ? INSURANCE_CLAIM_APPEAL_PRICING.standardMail : mailingMethod === "certified" ? INSURANCE_CLAIM_APPEAL_PRICING.certifiedMail : INSURANCE_CLAIM_APPEAL_PRICING.registeredMail;
          const total = Number((INSURANCE_CLAIM_APPEAL_PRICING.preparationFee + responsePrinting + supportingPrinting + mailing).toFixed(2));
          const pricedPacket = { ...packet, pricing: INSURANCE_CLAIM_APPEAL_PRICING, responseSheets, supportingSheets, totalPreparation: INSURANCE_CLAIM_APPEAL_PRICING.preparationFee, responsePrinting, supportingPrinting, mailing, total };

          const currentVersion = appeal.version ?? 1;
          const { error: updateError } = await supabase.from("appeals").update({ status: "ready", review, packet: pricedPacket, version: currentVersion + 1, updated_at: new Date().toISOString() }).eq("id", appealId).eq("user_id", user.id).eq("version", currentVersion);
          if (updateError) throw new Error(`Unable to approve appeal: ${updateError.message}`);
          return Response.json({ ok: true, appealId, status: "ready", review, packet: pricedPacket });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to approve appeal.";
          return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 502 });
        }
      },
    },
  },
});
