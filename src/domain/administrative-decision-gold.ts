export const ADMINISTRATIVE_DECISION_GOLD_CAPABILITIES = [
  "document-classification","fact-extraction","authority-resolution","deadline-verification","appeal-path-verification","evidence-analysis","contradiction-detection","timeline-analysis","adversarial-stress-test","response-strategy","drafting","independent-validation","readiness","human-approval","deterministic-pdf","submission","mailing","proof",
] as const;

export const ADMINISTRATIVE_DECISION_AUTHORITY_RULES = [
  "Never infer a universal deadline.",
  "Never assume exhaustion.",
  "Never invent a filing destination or recipient.",
  "Never treat a decision date as a filing deadline without authority support.",
  "Keep administrative and judicial review paths distinct.",
] as const;

export const ADMINISTRATIVE_DECISION_GOLD = {
  workflowId: "administrative-decision-appeal",
  title: "Appeal an Administrative Decision",
  capabilities: ADMINISTRATIVE_DECISION_GOLD_CAPABILITIES,
  authorityRules: ADMINISTRATIVE_DECISION_AUTHORITY_RULES,
  lifecycle: "authority",
} as const;
