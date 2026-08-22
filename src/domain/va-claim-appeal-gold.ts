export const VA_CLAIM_APPEAL_PRICING = { preparationFee: 34.99, includedResponsePages: 4, responsePagePrice: 0.45, supportingPagePrice: 0.25, standardMail: 5.49, certifiedMail: 12.49, certifiedReturnReceipt: 14.99, registeredMail: 29.99, flatEnvelopeFee: 2.5 } as const;

export const VA_CLAIM_APPEAL_AUTHORITY_SOURCES = [
  { title: "VA Decision Reviews and Appeals", url: "https://www.va.gov/decision-reviews/" },
  { title: "VA Decision Reviews FAQs", url: "https://www.va.gov/resources/decision-reviews-faqs/" },
  { title: "VA Choosing a Decision Review Option", url: "https://www.va.gov/resources/choosing-a-decision-review-option/" },
  { title: "VA Board Appeals", url: "https://www.va.gov/decision-reviews/board-appeal/" },
  { title: "VA Supplemental Claims", url: "https://www.va.gov/decision-reviews/supplemental-claim/" },
  { title: "VA Higher-Level Reviews", url: "https://www.va.gov/decision-reviews/higher-level-review/" },
] as const;

export const VA_CLAIM_APPEAL_CAPABILITIES = ["classification","fact-extraction","authority","deadline-analysis","evidence","contradictions","timeline","decision-review-routing","strategy","drafting","validation","readiness","pricing","proof"] as const;

export const VA_CLAIM_APPEAL_GOLD = {
  workflowId: "va-claim-appeal", lifecycle: "authority", capabilities: [...VA_CLAIM_APPEAL_CAPABILITIES],
  authorityRules: [
    "Never invent VA deadlines, forms, filing destinations, review eligibility, evidence requirements, or outcomes.",
    "Separate Supplemental Claim, Higher-Level Review, and Board Appeal pathways.",
    "Treat the VA decision letter and current VA authoritative sources as the controlling record.",
    "A Higher-Level Review cannot consider new evidence; Supplemental Claims require new and relevant evidence; Board evidence rules depend on the selected review lane.",
    "Do not infer service connection, nexus, rating, effective date, medical facts, or entitlement from incomplete records.",
  ], authoritySources: [...VA_CLAIM_APPEAL_AUTHORITY_SOURCES], pricing: VA_CLAIM_APPEAL_PRICING,
} as const;
