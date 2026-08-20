import type { CapabilityPack, ConstructedWorkflow } from "./workflow-capabilities";

export const REQUIRED_GOLD_CAPABILITIES: readonly CapabilityPack[] = [
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
];

export interface GoldStandardGateResult {
  passed: boolean;
  missingCapabilities: CapabilityPack[];
  missingPipelineSteps: string[];
  blockingReasons: string[];
}

const REQUIRED_STEPS = [
  "document",
  "xray",
  "decision",
  "timeline",
  "grounds",
  "evidence",
  "arguments",
  "stress-test",
  "draft",
  "final-stress-test",
  "readiness",
  "packet",
  "recipient",
  "mailing",
  "checkout",
  "proof",
  "submitted",
] as const;

export function evaluateGoldStandardGate(workflow: ConstructedWorkflow): GoldStandardGateResult {
  const capabilities = new Set(workflow.capabilities);
  const steps = new Set(workflow.definition.steps);
  const missingCapabilities = REQUIRED_GOLD_CAPABILITIES.filter((capability) => !capabilities.has(capability));
  const missingPipelineSteps = REQUIRED_STEPS.filter((step) => !steps.has(step));
  const blockingReasons: string[] = [];

  if (workflow.errors.length > 0) blockingReasons.push(...workflow.errors);
  if (!workflow.packs) blockingReasons.push("No registered domain pack");
  if (!workflow.qualityGate.proofReady) blockingReasons.push("Proof capability is not ready");
  if (!workflow.qualityGate.submissionReadiness) blockingReasons.push("Submission readiness gate is not satisfied");
  if (missingCapabilities.length > 0) blockingReasons.push(`Missing capabilities: ${missingCapabilities.join(", ")}`);
  if (missingPipelineSteps.length > 0) blockingReasons.push(`Missing pipeline steps: ${missingPipelineSteps.join(", ")}`);

  return {
    passed: blockingReasons.length === 0,
    missingCapabilities,
    missingPipelineSteps,
    blockingReasons,
  };
}
