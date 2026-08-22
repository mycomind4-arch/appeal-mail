export const AGENCY_DECISION_PRICING = {
  preparationFee: 24.99,
  includedResponsePages: 3,
  responsePagePrice: 0.40,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.50,
} as const;

export function calculateAgencyDecisionTotal(input: { responseSheets: number; supportingSheets: number; mailingMethod: "standard" | "certified" | "registered"; envelopeSurcharge?: boolean }) {
  const responseSheets = Math.max(1, Math.floor(input.responseSheets));
  const supportingSheets = Math.max(0, Math.floor(input.supportingSheets));
  const responsePrinting = Math.max(0, responseSheets - AGENCY_DECISION_PRICING.includedResponsePages) * AGENCY_DECISION_PRICING.responsePagePrice;
  const supportingPrinting = supportingSheets * AGENCY_DECISION_PRICING.supportingPagePrice;
  const mailing = input.mailingMethod === "standard" ? AGENCY_DECISION_PRICING.standardMail : input.mailingMethod === "certified" ? AGENCY_DECISION_PRICING.certifiedMail : AGENCY_DECISION_PRICING.registeredMail;
  const surcharge = input.envelopeSurcharge ? AGENCY_DECISION_PRICING.flatEnvelopeFee : 0;
  const total = AGENCY_DECISION_PRICING.preparationFee + responsePrinting + supportingPrinting + mailing + surcharge;
  return { preparationFee: AGENCY_DECISION_PRICING.preparationFee, responseSheets, supportingSheets, responsePrinting, supportingPrinting, mailing, surcharge, total: Number(total.toFixed(2)) };
}
