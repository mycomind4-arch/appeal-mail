export const LICENSING_APPEAL_PRICING = {
  preparationFee: 29.99,
  includedResponsePages: 4,
  responsePagePrice: 0.40,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.50,
} as const;

export function calculateLicensingAppealTotal(input: {
  responseSheets: number;
  supportingSheets: number;
  mailingMethod: "standard" | "certified" | "registered";
  envelopeSurcharge?: boolean;
}) {
  const responseSheets = Math.max(1, Math.floor(input.responseSheets));
  const supportingSheets = Math.max(0, Math.floor(input.supportingSheets));
  const responsePrinting = Math.max(0, responseSheets - LICENSING_APPEAL_PRICING.includedResponsePages) * LICENSING_APPEAL_PRICING.responsePagePrice;
  const supportingPrinting = supportingSheets * LICENSING_APPEAL_PRICING.supportingPagePrice;
  const mailing = input.mailingMethod === "standard" ? LICENSING_APPEAL_PRICING.standardMail : input.mailingMethod === "certified" ? LICENSING_APPEAL_PRICING.certifiedMail : LICENSING_APPEAL_PRICING.registeredMail;
  const surcharge = input.envelopeSurcharge ? LICENSING_APPEAL_PRICING.flatEnvelopeFee : 0;
  const total = LICENSING_APPEAL_PRICING.preparationFee + responsePrinting + supportingPrinting + mailing + surcharge;
  return { preparationFee: LICENSING_APPEAL_PRICING.preparationFee, responseSheets, supportingSheets, responsePrinting, supportingPrinting, mailing, surcharge, total: Number(total.toFixed(2)) };
}
