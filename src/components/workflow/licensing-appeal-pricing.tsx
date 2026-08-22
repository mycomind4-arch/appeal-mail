import { LICENSING_APPEAL_PRICING } from "@/domain/licensing-appeal-pricing";

export function LicensingAppealPricing() {
  return <section className="rounded-2xl border border-rule bg-paper-deep p-6">
    <div className="flex items-baseline justify-between gap-4"><div><div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Transparent packet pricing</div><h2 className="mt-2 font-serif text-2xl">Licensing appeal from ${LICENSING_APPEAL_PRICING.preparationFee.toFixed(2)}</h2></div><span className="text-sm text-muted-foreground">Final price uses physical sheets</span></div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-rule bg-paper p-4"><div className="font-medium">Preparation</div><div className="mt-1 text-sm text-muted-foreground">${LICENSING_APPEAL_PRICING.preparationFee.toFixed(2)} includes the first {LICENSING_APPEAL_PRICING.includedResponsePages} response sheets.</div></div>
      <div className="rounded-xl border border-rule bg-paper p-4"><div className="font-medium">Additional response sheets</div><div className="mt-1 text-sm text-muted-foreground">${LICENSING_APPEAL_PRICING.responsePagePrice.toFixed(2)} each.</div></div>
      <div className="rounded-xl border border-rule bg-paper p-4"><div className="font-medium">Supporting-document sheets</div><div className="mt-1 text-sm text-muted-foreground">${LICENSING_APPEAL_PRICING.supportingPagePrice.toFixed(2)} each.</div></div>
      <div className="rounded-xl border border-rule bg-paper p-4"><div className="font-medium">Mailing</div><div className="mt-1 text-sm text-muted-foreground">Standard ${LICENSING_APPEAL_PRICING.standardMail.toFixed(2)} · Certified ${LICENSING_APPEAL_PRICING.certifiedMail.toFixed(2)} · Registered ${LICENSING_APPEAL_PRICING.registeredMail.toFixed(2)}.</div></div>
    </div>
    <p className="mt-4 text-xs leading-5 text-muted-foreground">The checkout total is calculated after the final packet is approved. There is no hidden page bundle: the price reflects the response sheets, supporting sheets, mailing method, and any applicable envelope surcharge.</p>
  </section>;
}
