import { AGENCY_DECISION_PRICING } from "@/domain/agency-decision-pricing";

export function AgencyDecisionPricing() {
  return <section className="rounded-2xl border border-rule bg-paper-deep p-6">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div><div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Transparent pricing</div><h2 className="mt-2 font-serif text-2xl">Pay for the work and the physical packet</h2></div>
      <div className="text-2xl font-semibold">From ${AGENCY_DECISION_PRICING.preparationFee.toFixed(2)}</div>
    </div>
    <div className="mt-5 grid gap-3 text-sm md:grid-cols-2">
      <div className="rounded-xl border border-rule bg-paper p-4"><div className="font-medium">Preparation</div><div className="mt-1 text-muted-foreground">${AGENCY_DECISION_PRICING.preparationFee.toFixed(2)} includes up to {AGENCY_DECISION_PRICING.includedResponsePages} response sheets.</div></div>
      <div className="rounded-xl border border-rule bg-paper p-4"><div className="font-medium">Additional response sheets</div><div className="mt-1 text-muted-foreground">${AGENCY_DECISION_PRICING.responsePagePrice.toFixed(2)} each.</div></div>
      <div className="rounded-xl border border-rule bg-paper p-4"><div className="font-medium">Supporting-document sheets</div><div className="mt-1 text-muted-foreground">${AGENCY_DECISION_PRICING.supportingPagePrice.toFixed(2)} each.</div></div>
      <div className="rounded-xl border border-rule bg-paper p-4"><div className="font-medium">Mailing</div><div className="mt-1 text-muted-foreground">Standard ${AGENCY_DECISION_PRICING.standardMail.toFixed(2)} · Certified ${AGENCY_DECISION_PRICING.certifiedMail.toFixed(2)} · Registered ${AGENCY_DECISION_PRICING.registeredMail.toFixed(2)}</div></div>
    </div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">Your exact total is calculated after the final response and supporting packet are approved. No hidden page-count charge is added later.</p>
  </section>;
}
