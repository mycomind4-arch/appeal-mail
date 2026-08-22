export const SOCIAL_SECURITY_OVERPAYMENT_PRICING = {
  preparationFee: 27.99,
  includedResponsePages: 3,
  responsePagePrice: 0.4,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  certifiedReturnReceipt: 14.99,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.5,
} as const;

export const SOCIAL_SECURITY_OVERPAYMENT_CAPABILITIES = [
  "document-classification","fact-extraction","authority-resolution","overpayment-calculation-review","reconsideration-vs-waiver-routing","deadline-verification","evidence-analysis","contradiction-detection","timeline-analysis","adversarial-stress-test","response-strategy","drafting","independent-validation","readiness","human-approval","pricing","deterministic-pdf","submission","mailing","proof",
] as const;

export const SOCIAL_SECURITY_OVERPAYMENT_RULES = [
  "Never invent the overpayment amount, period, or reason.",
  "Keep reconsideration, waiver, and repayment-rate requests distinct.",
  "Never invent a filing destination or recipient.",
  "Verify the notice date and receipt-based timing before stating a deadline.",
  "Never invent financial hardship or fault facts.",
  "Distinguish Title II and Title XVI rules when the record requires it.",
] as const;

export const SOCIAL_SECURITY_OVERPAYMENT_GOLD = {
  workflowId: "social-security-overpayment",
  title: "Appeal a Social Security Overpayment",
  lifecycle: "authority",
  capabilities: SOCIAL_SECURITY_OVERPAYMENT_CAPABILITIES,
  authorityRules: SOCIAL_SECURITY_OVERPAYMENT_RULES,
  pricing: SOCIAL_SECURITY_OVERPAYMENT_PRICING,
} as const;
