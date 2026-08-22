export const APPEALS_COUNCIL_CAPABILITIES = [
  "document-classification","fact-extraction","authority-resolution","deadline-verification","appeal-path-verification","hearing-decision-analysis","error-and-evidence-analysis","contradiction-detection","timeline-analysis","new-evidence-analysis","adversarial-stress-test","response-strategy","drafting","independent-validation","readiness","human-approval","deterministic-pdf","submission","mailing","proof","pricing",
] as const;

export const APPEALS_COUNCIL_AUTHORITY_RULES = [
  "Treat the actual SSA notice and current SSA authority as controlling.",
  "Never invent an Appeals Council deadline or filing method.",
  "Preserve the distinction between the hearing decision, reconsideration, and Appeals Council review.",
  "Do not invent medical, vocational, employment, procedural, or legal facts.",
  "Do not assume new evidence qualifies for consideration; surface the applicable rule and uncertainty.",
  "Do not promise that the Appeals Council will grant review, remand, or change the decision.",
] as const;

export const APPEALS_COUNCIL_AUTHORITY_SOURCES = [
  { title: "SSA — Request review of hearing decision", url: "https://www.ssa.gov/apply/appeal-decision-we-made/request-review-hearing-decision", freshnessRule: "verify-before-use" },
  { title: "SSA — Appeals Council Review Process", url: "https://www.ssa.gov/appeals/appeals_process.html", freshnessRule: "verify-before-use" },
  { title: "SSA — Form HA-520", url: "https://www.ssa.gov/forms/ha-520.html", freshnessRule: "verify-before-use" },
  { title: "SSA — 20 CFR 404.968", url: "https://www.ssa.gov/OP_Home/cfr20/404/404-0968.htm", freshnessRule: "verify-before-use" },
  { title: "SSA — 20 CFR 416.1468", url: "https://www.ssa.gov/OP_Home/cfr20/416/416-1468.htm", freshnessRule: "verify-before-use" },
] as const;

export const APPEALS_COUNCIL_PRICING = {
  preparationFee: 34.99,
  includedResponsePages: 4,
  responsePagePrice: 0.45,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.99,
  certifiedReturnReceipt: 15.99,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.50,
} as const;

export const APPEALS_COUNCIL_GOLD = {
  workflowId: "appeals-council",
  title: "Request Appeals Council Review",
  lifecycle: "authority",
  capabilities: APPEALS_COUNCIL_CAPABILITIES,
  authorityRules: APPEALS_COUNCIL_AUTHORITY_RULES,
  authoritySources: APPEALS_COUNCIL_AUTHORITY_SOURCES,
  pricing: APPEALS_COUNCIL_PRICING,
} as const;
