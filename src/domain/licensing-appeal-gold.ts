export const LICENSING_APPEAL_GOLD_CAPABILITIES = [
  "document-classification","fact-extraction","authority-resolution","deadline-verification","appeal-path-verification","evidence-analysis","contradiction-detection","timeline-analysis","adversarial-stress-test","response-strategy","drafting","independent-validation","readiness","human-approval","deterministic-pdf","submission","mailing","proof",
] as const;

export const LICENSING_APPEAL_AUTHORITY_RULES = [
  "Never infer a universal licensing deadline.",
  "Never assume the licensing board, agency, hearing officer, or tribunal.",
  "Never invent a filing destination, form, address, portal, or service method.",
  "Never turn a suspension/revocation effective date into an appeal deadline without authority support.",
  "Keep administrative licensing review distinct from judicial review.",
  "Do not treat a professional licensing rule as applicable outside the identified license and jurisdiction.",
] as const;

export const LICENSING_APPEAL_GOLD = {
  workflowId: "licensing-appeal",
  title: "Appeal a Licensing Decision",
  capabilities: LICENSING_APPEAL_GOLD_CAPABILITIES,
  authorityRules: LICENSING_APPEAL_AUTHORITY_RULES,
  lifecycle: "authority",
} as const;
