export const SNAP_ELIGIBILITY_APPEAL_PRICING = {
  preparationFee: 26.99,
  includedResponsePages: 3,
  responsePagePrice: 0.4,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  certifiedReturnReceipt: 14.99,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.5,
} as const;

export const SNAP_ELIGIBILITY_APPEAL_AUTHORITY_SOURCES = [
  { title: "USDA FNS SNAP program resources", url: "https://www.fns.usda.gov/snap" },
  { title: "7 CFR Part 273 — SNAP eligibility and administration", url: "https://www.ecfr.gov/current/title-7/subtitle-B/chapter-II/subchapter-C/part-273" },
  { title: "USDA FNS SNAP state directory", url: "https://www.fns.usda.gov/snap/state-directory" },
] as const;

export const SNAP_ELIGIBILITY_APPEAL_CAPABILITIES = [
  "classification", "fact-extraction", "authority", "deadline-analysis", "eligibility-analysis",
  "evidence", "contradictions", "timeline", "strategy", "drafting", "validation", "readiness", "pricing", "proof",
] as const;

export const SNAP_ELIGIBILITY_APPEAL_GOLD = {
  workflowId: "snap-eligibility-appeal",
  lifecycle: "authority",
  capabilities: [...SNAP_ELIGIBILITY_APPEAL_CAPABILITIES],
  authorityRules: [
    "Never invent SNAP eligibility facts or household circumstances.",
    "Separate federal SNAP eligibility rules from state-administered procedure and verification requirements.",
    "Treat the denial or eligibility notice and current authoritative state/federal sources as the controlling record.",
    "Never invent deadlines, hearing forums, recipients, forms, filing methods, or outcomes.",
    "Flag conflicting income, household, residency, citizenship/qualified-status, resource, or verification evidence rather than resolving it by assumption.",
  ],
  authoritySources: [...SNAP_ELIGIBILITY_APPEAL_AUTHORITY_SOURCES],
  pricing: SNAP_ELIGIBILITY_APPEAL_PRICING,
} as const;
