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
  "document", "xray", "decision", "timeline", "grounds", "evidence", "arguments",
  "stress-test", "draft", "final-stress-test", "readiness", "packet", "recipient",
  "mailing", "checkout", "proof", "submitted",
] as const;

/**
 * Capabilities are certified from concrete packs, not from the factory's
 * default capability labels. Specialized analysis capabilities must also be
 * explicitly declared by the analysis pack.
 */
export function getExecutableCapabilities(workflow: ConstructedWorkflow): Set<CapabilityPack> {
  const packs = workflow.packs;
  const executable = new Set<CapabilityPack>();
  if (!packs) return executable;

  executable.add("document-classification");
  executable.add("fact-extraction");
  executable.add("deadline-analysis");
  executable.add("evidence-analysis");
  executable.add("contradiction-analysis");
  executable.add("drafting");
  executable.add("draft-validation");
  executable.add("readiness-review");
  executable.add("submission");
  executable.add("mailing");
  executable.add("proof");

  for (const capability of packs.analysis.capabilities) {
    executable.add(capability);
  }

  return executable;
}

export function evaluateGoldStandardGate(workflow: ConstructedWorkflow): GoldStandardGateResult {
  const capabilities = getExecutableCapabilities(workflow);
  const steps = new Set(workflow.definition.steps);
  const missingCapabilities = REQUIRED_GOLD_CAPABILITIES.filter((capability) => !capabilities.has(capability));
  const missingPipelineSteps = REQUIRED_STEPS.filter((step) => !steps.has(step));
  const blockingReasons: string[] = [];

  if (workflow.errors.length > 0) blockingReasons.push(...workflow.errors);
  if (!workflow.packs) blockingReasons.push("No registered domain pack");
  if (!workflow.qualityGate.proofReady) blockingReasons.push("Proof capability is not ready");
  if (!workflow.qualityGate.submissionReadiness) blockingReasons.push("Submission readiness gate is not satisfied");
  if (missingCapabilities.length > 0) blockingReasons.push(`Missing executable capabilities: ${missingCapabilities.join(", ")}`);
  if (missingPipelineSteps.length > 0) blockingReasons.push(`Missing pipeline steps: ${missingPipelineSteps.join(", ")}`);

  return {
    passed: blockingReasons.length === 0,
    missingCapabilities,
    missingPipelineSteps,
    blockingReasons,
  };
}
