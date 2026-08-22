export const WORKERS_COMP_APPEAL_PRICING = {
  preparationFee: 34.99,
  includedResponsePages: 4,
  responsePagePrice: 0.45,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  certifiedReturnReceipt: 14.99,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.5,
} as const;

export const WORKERS_COMP_AUTHORITY_SOURCES = [
  { title: "U.S. Department of Labor — Workers' Compensation Programs", url: "https://www.dol.gov/agencies/owcp" },
  { title: "eCFR — Workers' Compensation regulations", url: "https://www.ecfr.gov/current/title-20/chapter-I/subchapter-A" },
  { title: "State workers' compensation authority directory", url: "https://www.dol.gov/agencies/owcp" },
] as const;

export const WORKERS_COMP_CAPABILITIES = [
  "classification","fact-extraction","authority","deadline-analysis","evidence","contradictions",
  "timeline","strategy","drafting","validation","readiness","pricing","proof",
] as const;

export const WORKERS_COMP_APPEAL_GOLD = {
  workflowId: "workers-comp-appeal",
  lifecycle: "authority",
  capabilities: [...WORKERS_COMP_CAPABILITIES],
  authorityRules: [
    "Never invent workers' compensation deadlines, forms, filing destinations, hearing forums, medical facts, wage facts, employer facts, or outcomes.",
    "Treat the injury notice and current state/federal authoritative sources as the controlling record.",
    "Separate federal resources from the controlling state workers' compensation procedure.",
    "Do not infer compensability, impairment, disability status, or entitlement from incomplete records.",
  ],
  authoritySources: [...WORKERS_COMP_AUTHORITY_SOURCES],
  pricing: WORKERS_COMP_APPEAL_PRICING,
} as const;
