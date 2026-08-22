import { createFileRoute } from "@tanstack/react-router";
import { AppealWorkflowWorkspace } from "@/components/workflow/appeal-workflow-workspace";
import { INSURANCE_CLAIM_APPEAL_AUTHORITY_SOURCES, INSURANCE_CLAIM_APPEAL_PRICING, INSURANCE_CLAIM_APPEAL_RULES } from "@/domain/insurance-claim-appeal-gold";

export const Route = createFileRoute("/workflows/insurance-claim-appeal")({
  head: () => ({
    meta: [
      { title: "Appeal an Insurance Claim Decision — Authority-First | Appeal Mail" },
      { name: "description", content: "Analyze an insurance claim denial, separate insurer findings from disputed facts, verify the controlling appeal path, map evidence gaps, and prepare a human-reviewed response with transparent packet pricing." },
      { property: "og:title", content: "Appeal an Insurance Claim Decision" },
      { property: "og:description", content: "Authority-first insurance claim appeal analysis with source verification, Gemini drafting, independent validation, transparent pricing, and mailing proof." },
    ],
    links: [{ rel: "canonical", href: "/workflows/insurance-claim-appeal" }],
  }),
  component: InsuranceClaimAppealPage,
});

function InsuranceClaimAppealPage() {
  return (
    <main className="min-h-screen bg-paper px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Insurance Claim Appeal • Authority-first Gold</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Appeal an Insurance Claim Decision</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">Start with the actual insurer decision or denial. The workflow separates what the insurer says from what your records support, identifies the governing policy or plan material, flags evidence gaps and contradictions, and keeps uncertain procedure visible instead of guessing.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[["Authority raised","Policy, plan, insurer, and state procedure are verified before consequential procedural claims."],["Evidence-aware","Claim facts, denial reasons, cited terms, supporting records, contradictions, and unresolved issues stay distinct."],["Human controlled","Gemini drafts and independently validates; nothing is mailed without explicit approval and payment."]].map(([title,copy]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-300">{copy}</p></div>)}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-3xl border border-rule bg-paper-deep p-7 md:p-8">
            <h2 className="font-serif text-3xl">What the Gold workflow checks</h2>
            <ol className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">{[
              "Extract the issuer, claim/reference number, decision date, stated denial reason, cited policy language, and appeal instructions.",
              "Separate documented claim facts from insurer findings, disputed facts, assumptions, and missing evidence.",
              "Verify the controlling appeal path and deadline from the actual decision and current authoritative sources.",
              "Map evidence gaps and contradictions, then stress-test the proposed response before drafting.",
              "Independently validate the draft, require human approval, calculate the physical packet price, and only then allow payment and mailing.",
            ].map((text,index) => <li key={text} className="flex gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">{index+1}</span><span>{text}</span></li>)}</ol>
          </div>

          <div className="rounded-3xl border border-rule bg-paper p-7 md:p-8">
            <h2 className="font-serif text-3xl">Straightforward pricing</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Your exact total is calculated from the approved physical packet. The starting preparation price assumes {INSURANCE_CLAIM_APPEAL_PRICING.includedResponsePages} response sheets and no supporting-document sheets.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Preparation", `$${INSURANCE_CLAIM_APPEAL_PRICING.preparationFee.toFixed(2)}`],
                ["Extra response", `$${INSURANCE_CLAIM_APPEAL_PRICING.responsePagePrice.toFixed(2)} / sheet`],
                ["Supporting documents", `$${INSURANCE_CLAIM_APPEAL_PRICING.supportingPagePrice.toFixed(2)} / sheet`],
                ["Standard mailing", `$${INSURANCE_CLAIM_APPEAL_PRICING.standardMail.toFixed(2)}`],
                ["Certified mailing", `$${INSURANCE_CLAIM_APPEAL_PRICING.certifiedMail.toFixed(2)}`],
                ["Certified + return receipt", `$${INSURANCE_CLAIM_APPEAL_PRICING.certifiedReturnReceipt.toFixed(2)}`],
                ["Registered mailing", `$${INSURANCE_CLAIM_APPEAL_PRICING.registeredMail.toFixed(2)}`],
                ["Packet surcharge", `$${INSURANCE_CLAIM_APPEAL_PRICING.flatEnvelopeFee.toFixed(2)} when required`],
              ].map(([label,value]) => <div key={label} className="rounded-2xl bg-paper-deep p-4"><div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div><div className="mt-1 font-semibold">{value}</div></div>)}
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-rule bg-paper p-7">
          <h2 className="font-serif text-2xl">Authority and uncertainty rules</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">{INSURANCE_CLAIM_APPEAL_RULES.map(rule => <div key={rule} className="rounded-2xl bg-paper-deep p-4 text-sm leading-6">{rule}</div>)}</div>
          <p className="mt-5 text-xs leading-6 text-muted-foreground">Reference framework: {INSURANCE_CLAIM_APPEAL_AUTHORITY_SOURCES.map(source => source.title).join(" • ")}</p>
        </section>

        <section className="mt-8">
          <AppealWorkflowWorkspace workflowId="denied-claim" suppressH1 />
        </section>
      </div>
    </main>
  );
}
