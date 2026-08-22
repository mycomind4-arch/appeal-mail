export const MEDICAID_APPEAL_PRICING = {
  preparationFee: 27.99,
  includedResponsePages: 4,
  responsePagePrice: 0.40,
  supportingPagePrice: 0.25,
  standardMail: 5.49,
  certifiedMail: 12.49,
  certifiedReturnReceipt: 14.99,
  registeredMail: 29.99,
  flatEnvelopeFee: 2.50,
} as const;

export const MEDICAID_APPEAL_AUTHORITY_SOURCES = [
  { name: "Medicaid.gov", purpose: "Federal Medicaid program guidance and beneficiary rights", url: "https://www.medicaid.gov/" },
  { name: "CMS Medicaid & CHIP", purpose: "Federal program policy and appeals context", url: "https://www.medicaid.gov/medicaid/appeals/index.html" },
  { name: "State Medicaid agency", purpose: "State-specific notice, fair-hearing, filing, and deadline requirements", url: "https://www.medicaid.gov/about-us/contact-us/index.html" },
];

export const MEDICAID_APPEAL_GOLD = {
  workflowId: "medicaid-appeal",
  lifecycle: "authority" as const,
  capabilities: ["classification","facts","deadlines","authority","evidence","contradictions","timeline","strategy","draft","validation","readiness","pricing","mailing","proof"],
  authorityRules: [
    "Never invent a Medicaid deadline, hearing forum, recipient, form, filing method, eligibility rule, or outcome.",
    "Treat the beneficiary notice and current state Medicaid authority as controlling for state-specific procedure.",
    "Separate federal Medicaid requirements from state-administered procedures.",
    "Never invent medical, financial, household, or eligibility facts.",
  ],
  pricing: MEDICAID_APPEAL_PRICING,
  authoritySources: MEDICAID_APPEAL_AUTHORITY_SOURCES,
};
