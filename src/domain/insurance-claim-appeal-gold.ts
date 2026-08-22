export const INSURANCE_CLAIM_APPEAL_PRICING = {
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

export const INSURANCE_CLAIM_APPEAL_AUTHORITY_SOURCES = [
  { title: "National Association of Insurance Commissioners — Consumer Resources", url: "https://content.naic.org/consumer" },
  { title: "USA.gov — State Insurance Departments", url: "https://www.usa.gov/state-insurance" },
  { title: "CMS — Health Insurance Appeals & External Review", url: "https://www.healthcare.gov/appeal-insurance-company-decision/" },
] as const;

export const INSURANCE_CLAIM_APPEAL_RULES = [
  "Never invent policy terms, coverage, diagnoses, damages, eligibility, deadlines, recipients, forms, filing methods, or outcomes.",
  "Treat the denial/decision notice and the governing plan or policy record as the primary matter record.",
  "Resolve the controlling state, plan, insurer, or program procedure before stating a consequential procedural requirement.",
  "Separate documented facts, insurer findings, cited policy language, disputed facts, evidence gaps, and unresolved questions.",
] as const;
