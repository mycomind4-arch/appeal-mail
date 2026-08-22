import { AGENCY_AUTHORITY_RULES } from "./agency-decision-authority";

export const agencyDecisionGoldPack = {
  id: "agency-decision-appeal",
  title: "Appeal an Agency Decision",
  authorityRules: AGENCY_AUTHORITY_RULES,
  capabilities: [
    "document-classification",
    "fact-extraction",
    "authority-resolution",
    "deadline-verification",
    "appeal-path-verification",
    "evidence-gap-analysis",
    "contradiction-detection",
    "timeline-analysis",
    "xray-analysis",
    "adversarial-stress-test",
    "response-strategy",
    "drafting",
    "independent-validation",
    "readiness",
    "human-approval",
    "deterministic-pdf",
    "stripe-checkout",
    "mailmypdf-fulfillment",
    "provider-proof",
  ] as const,
  prohibitedInferences: [
    "universal-deadline",
    "automatic-exhaustion",
    "default-review-level",
    "invented-recipient",
    "invented-filing-method",
    "unsupported-factual-assertion",
  ] as const,
} as const;

export function getAgencyDecisionGoldCapabilities() {
  return [...agencyDecisionGoldPack.capabilities];
}
