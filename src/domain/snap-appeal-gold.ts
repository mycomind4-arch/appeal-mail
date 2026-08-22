export const SNAP_APPEAL_PRICING = {
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

export const SNAP_APPEAL_AUTHORITY_SOURCES = [
  { title: "USDA SNAP program", url: "https://www.fns.usda.gov/snap" },
  { title: "Food and Nutrition Act — fair hearing provisions", url: "https://snaped.fns.usda.gov/sites/default/files/documents/Food%20And%20Nutrition%20Act%20Of%202008.pdf" },
  { title: "7 CFR Part 273 — SNAP administration", url: "https://www.ecfr.gov/current/title-7/subtitle-B/chapter-II/subchapter-C/part-273" },
] as const;

export const SNAP_APPEAL_CAPABILITIES = [
  "classification", "fact-extraction", "authority", "deadline-analysis", "evidence", "contradictions",
  "timeline", "strategy", "drafting", "validation", "readiness", "pricing", "proof",
] as const;

export const SNAP_APPEAL_GOLD = {
  workflowId: "snap-appeal",
  lifecycle: "authority",
  capabilities: [...SNAP_APPEAL_CAPABILITIES],
  authorityRules: [
    "Never invent SNAP deadlines, hearing forums, filing methods, recipients, eligibility facts, or outcomes.",
    "Separate federal SNAP rules from state-agency procedure.",
    "Treat the notice and current state/federal authoritative sources as the controlling record.",
    "Never invent household composition, income, resources, verification facts, or immigration facts.",
  ],
  authoritySources: [...SNAP_APPEAL_AUTHORITY_SOURCES],
  pricing: SNAP_APPEAL_PRICING,
} as const;
