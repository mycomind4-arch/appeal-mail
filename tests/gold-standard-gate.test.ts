import test from "node:test";
import assert from "node:assert/strict";
import { evaluateGoldStandardGate } from "../src/domain/gold-standard-gate";

function baseWorkflow() {
  return {
    definition: {
      id: "denied-claim",
      title: "Denied Claim",
      description: "test",
      disclaimer: "test",
      steps: [
        "document", "xray", "decision", "timeline", "grounds", "evidence", "arguments",
        "stress-test", "draft", "final-stress-test", "readiness", "packet", "recipient",
        "mailing", "checkout", "proof", "submitted",
      ],
      stepLabels: [],
      decisionFields: [],
      focusAreas: [],
      deadlineWarning: "",
    },
    capabilities: [
      "document-classification", "fact-extraction", "deadline-analysis", "evidence-analysis",
      "contradiction-analysis", "xray-analysis", "timeline-analysis", "stress-testing",
      "response-strategy", "drafting", "draft-validation", "readiness-review", "submission",
      "mailing", "proof",
    ],
    packs: {},
    qualityGate: {
      documentRecognition: true,
      factGrounding: true,
      deadlineVerification: true,
      evidenceGrounding: true,
      draftValidation: true,
      submissionReadiness: true,
      proofReady: true,
    },
    lifecycle: "authority",
    warnings: [],
    errors: [],
    ready: true,
  } as never;
}

test("complete workflow passes strict gold-standard gate", () => {
  assert.equal(evaluateGoldStandardGate(baseWorkflow()).passed, true);
});

test("missing capability blocks gold-standard certification", () => {
  const workflow = baseWorkflow();
  workflow.capabilities = workflow.capabilities.filter((capability) => capability !== "response-strategy");
  const result = evaluateGoldStandardGate(workflow);
  assert.equal(result.passed, false);
  assert.ok(result.missingCapabilities.includes("response-strategy"));
});

test("missing pipeline step blocks gold-standard certification", () => {
  const workflow = baseWorkflow();
  workflow.definition.steps = workflow.definition.steps.filter((step) => step !== "final-stress-test");
  const result = evaluateGoldStandardGate(workflow);
  assert.equal(result.passed, false);
  assert.ok(result.missingPipelineSteps.includes("final-stress-test"));
});
