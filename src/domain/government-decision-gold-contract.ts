import { constructWorkflow, getDomainPack } from "./workflow-capabilities";

export const REQUIRED_GOLD_CAPABILITIES = [
  "document-classification",
  "fact-extraction",
  "deadline-analysis",
  "evidence-analysis",
  "contradiction-analysis",
  "xray-analysis",
  "timeline-analysis",
  "stress-testing",
  "response-strategy",
  "drafting",
  "draft-validation",
  "readiness-review",
  "submission",
  "mailing",
  "proof",
] as const;

export { constructWorkflow, getDomainPack };
