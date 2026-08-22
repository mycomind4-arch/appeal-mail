export const GOVERNMENT_DECISION_PRICING = {
  preparationFee: 24.99,
  includedResponsePages: 3,
  responsePagePrice: 0.40,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  certifiedReturnReceipt: 14.99,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.50,
} as const;

export function calculateGovernmentDecisionTotal(input: {
  responseSheets: number;
  supportingSheets: number;
  mailingMethod: "standard" | "certified" | "registered";
  envelopeSurcharge?: boolean;
}) {
  const responseSheets = Math.max(1, Math.floor(input.responseSheets));
  const supportingSheets = Math.max(0, Math.floor(input.supportingSheets));
  const responsePrinting = Math.max(0, responseSheets - GOVERNMENT_DECISION_PRICING.includedResponsePages) * GOVERNMENT_DECISION_PRICING.responsePagePrice;
  const supportingPrinting = supportingSheets * GOVERNMENT_DECISION_PRICING.supportingPagePrice;
  const mailing = input.mailingMethod === "standard" ? GOVERNMENT_DECISION_PRICING.standardMail : input.mailingMethod === "certified" ? GOVERNMENT_DECISION_PRICING.certifiedMail : GOVERNMENT_DECISION_PRICING.registeredMail;
  const surcharge = input.envelopeSurcharge ? GOVERNMENT_DECISION_PRICING.flatEnvelopeFee : 0;
  const total = GOVERNMENT_DECISION_PRICING.preparationFee + responsePrinting + supportingPrinting + mailing + surcharge;
  return { preparationFee: GOVERNMENT_DECISION_PRICING.preparationFee, responseSheets, supportingSheets, responsePrinting, supportingPrinting, mailing, surcharge, total: Number(total.toFixed(2)) };
}
