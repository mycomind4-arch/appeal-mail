export const BENEFITS_DENIAL_APPEAL_PRICING = {
  preparationFee: 24.99,
  includedResponsePages: 3,
  responsePagePrice: 0.4,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  certifiedReturnReceipt: 14.99,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.5,
} as const;

export const BENEFITS_DENIAL_APPEAL_AUTHORITY_SOURCES = [
  { title: "USDA FNS SNAP and nutrition assistance resources", url: "https://www.fns.usda.gov/" },
  { title: "Medicaid.gov", url: "https://www.medicaid.gov/" },
  { title: "SSA — Benefits and appeals", url: "https://www.ssa.gov/" },
  { title: "USA.gov — Government benefits", url: "https://www.usa.gov/benefits" },
] as const;

export const BENEFITS_DENIAL_APPEAL_CAPABILITIES = [
  "classification","fact-extraction","authority","deadline-analysis","evidence","contradictions",
  "timeline","strategy","drafting","validation","readiness","pricing","proof",
] as const;

export const BENEFITS_DENIAL_APPEAL_GOLD = {
  workflowId: "benefits-denial-appeal",
  lifecycle: "authority",
  capabilities: [...BENEFITS_DENIAL_APPEAL_CAPABILITIES],
  authorityRules: [
    "Never invent benefit-program deadlines, hearing forums, filing methods, recipients, eligibility facts, or outcomes.",
    "Identify the exact benefit program and issuing agency before stating procedural rules.",
    "Separate federal program rules from state/local agency procedure.",
    "Treat the denial notice and current authoritative sources as the controlling record.",
    "Never invent household, income, medical, employment, residency, or eligibility facts.",
  ],
  authoritySources: [...BENEFITS_DENIAL_APPEAL_AUTHORITY_SOURCES],
  pricing: BENEFITS_DENIAL_APPEAL_PRICING,
} as const;
