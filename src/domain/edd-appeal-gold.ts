export const EDD_APPEAL_CAPABILITIES = [
  "document-classification","fact-extraction","authority-resolution","deadline-verification","appeal-path-verification","evidence-analysis","contradiction-detection","timeline-analysis","adversarial-stress-test","response-strategy","drafting","independent-validation","readiness","human-approval","pricing","deterministic-pdf","submission","mailing","proof",
] as const;

export const EDD_APPEAL_AUTHORITY_RULES = [
  "Use the exact EDD notice and current EDD/CUIAB authority sources.",
  "Never invent an EDD deadline, recipient, form, filing method, hearing rule, or good-cause standard.",
  "Distinguish unemployment insurance, disability/PFL, overpayment, employer, and other EDD matter types.",
  "Do not treat a notice issue date as the controlling deadline when the authoritative source specifies a different trigger.",
  "Preserve unresolved procedural questions for human confirmation.",
  "Never invent claimant, employer, wage, work-separation, medical, or eligibility facts.",
] as const;

export const EDD_APPEAL_AUTHORITY_SOURCES = [
  {name:"EDD Unemployment Insurance Appeals",url:"https://edd.ca.gov/en/unemployment/appeals/"},
  {name:"EDD Appeal Form DE 1000M",url:"https://edd.ca.gov/siteassets/files/pdf_pub_ctr/de1000m.pdf"},
  {name:"EDD Forms and Publications",url:"https://edd.ca.gov/en/unemployment/forms_and_publications"},
  {name:"EDD Time Limits for Appeals and Petitions",url:"https://edd.ca.gov/siteassets/files/pdf_pub_ctr/de1433.pdf"},
] as const;

export const EDD_APPEAL_PRICING = {
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

export const EDD_APPEAL_GOLD = {
  workflowId:"edd-appeal",
  title:"Appeal an EDD Decision",
  lifecycle:"authority" as const,
  capabilities: EDD_APPEAL_CAPABILITIES,
  authorityRules: EDD_APPEAL_AUTHORITY_RULES,
  authoritySources: EDD_APPEAL_AUTHORITY_SOURCES,
  pricing: EDD_APPEAL_PRICING,
};
