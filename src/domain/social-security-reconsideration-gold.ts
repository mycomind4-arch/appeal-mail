export const SOCIAL_SECURITY_RECONSIDERATION_CAPABILITIES = ["document-classification","fact-extraction","authority-resolution","deadline-verification","appeal-path-verification","evidence-analysis","contradiction-detection","timeline-analysis","adversarial-stress-test","response-strategy","drafting","independent-validation","readiness","human-approval","pricing","deterministic-pdf","submission","mailing","proof"] as const;

export const SOCIAL_SECURITY_RECONSIDERATION_AUTHORITY_RULES = [
  "Use the actual SSA notice plus current SSA sources as controlling authority.",
  "Never invent medical, vocational, financial, or procedural facts.",
  "Do not treat a notice date as a receipt date unless the governing SSA rule supports the calculation.",
  "The standard reconsideration period is 60 days after receipt, subject to governing SSA extension rules.",
  "Do not assume every SSA matter uses the same reconsideration route; distinguish disability and non-medical matters and preserve notice-specific instructions.",
  "Never promise a favorable result.",
] as const;

export const SOCIAL_SECURITY_RECONSIDERATION_AUTHORITY_SOURCES = [
  { title: "SSA — Appeal a decision we made", url: "https://www.ssa.gov/apply/appeal-decision-we-made", freshnessRule: "verify-before-use" },
  { title: "SSA — Request reconsideration", url: "https://www.ssa.gov/apply/appeal-decision-we-made/request-reconsideration", freshnessRule: "verify-before-use" },
  { title: "SSA — Form SSA-561", url: "https://www.ssa.gov/forms/ssa-561.html", freshnessRule: "verify-before-use" },
  { title: "20 CFR § 404.909", url: "https://www.ssa.gov/OP_Home/cfr20/404/404-0909.htm", freshnessRule: "verify-before-use" },
  { title: "20 CFR § 416.1409", url: "https://www.ssa.gov/OP_Home/cfr20/416/416-1409.htm", freshnessRule: "verify-before-use" },
] as const;

export const SOCIAL_SECURITY_RECONSIDERATION_PRICING = {
  preparationFee: 24.99,
  includedResponsePages: 4,
  responsePagePrice: 0.40,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  registeredMail: 29.99,
  certifiedReturnReceipt: 14.99,
  largePacketFee: 2.50,
  largePacketThresholdSheets: 7,
} as const;

export const SOCIAL_SECURITY_RECONSIDERATION_GOLD = {
  workflowId: "social-security-reconsideration",
  title: "Request Social Security Reconsideration",
  lifecycle: "authority",
  capabilities: SOCIAL_SECURITY_RECONSIDERATION_CAPABILITIES,
  authorityRules: SOCIAL_SECURITY_RECONSIDERATION_AUTHORITY_RULES,
  pricing: SOCIAL_SECURITY_RECONSIDERATION_PRICING,
  authoritySources: SOCIAL_SECURITY_RECONSIDERATION_AUTHORITY_SOURCES,
} as const;
