import { test, describe } from "node:test";
import assert from "node:assert/strict";

import { workflows } from "../src/domain/workflows";
import {
  constructWorkflow,
  constructAllWorkflows,
  factoryValidationSummary,
  validateDefinition,
  loadCapabilities,
  evaluateQualityGate,
  determineLifecycle,
  getDomainPack,
  getRegisteredWorkflowIds,
  registerDomainPack,
  ALL_CAPABILITIES,
  type DomainPackSet,
} from "../src/domain/workflow-capabilities";

import "../src/domain/insurance-packs";

/* ═══════════════════════════════════════════════════════════
   PARITY: Architecture Tests
   Tests the factory/registry/capability system matches
   Notice Respond's gold standard.
   ═══════════════════════════════════════════════════════════ */

describe("Factory Architecture", () => {
  test("all workflow definitions validate", () => {
    for (const [id, def] of Object.entries(workflows)) {
      const errors = validateDefinition(def);
      assert.equal(errors.length, 0, `Workflow ${id} validation errors: ${errors.join(", ")}`);
    }
  });

  test("denied-claim has domain pack registered", () => {
    const pack = getDomainPack("denied-claim");
    assert.ok(pack, "Insurance appeal domain pack should be registered");
    assert.equal(pack.engine, "appeal");
    assert.ok(pack.document, "Document pack missing");
    assert.ok(pack.deadline, "Deadline pack missing");
    assert.ok(pack.evidence, "Evidence pack missing");
    assert.ok(pack.analysis, "Analysis pack missing");
    assert.ok(pack.draft, "Draft pack missing");
    assert.ok(pack.validation, "Validation pack missing");
    assert.ok(pack.submission, "Submission pack missing");
  });

  test("denied-claim constructs as functional or authority lifecycle", () => {
    const constructed = constructWorkflow(workflows["denied-claim"]);
    assert.ok(constructed.ready, `Construction errors: ${constructed.errors.join(", ")}`);
    assert.ok(
      constructed.lifecycle === "functional" || constructed.lifecycle === "authority",
      `Expected functional or authority lifecycle, got ${constructed.lifecycle}`,
    );
  });

  test("denied-claim has all required capabilities", () => {
    const constructed = constructWorkflow(workflows["denied-claim"]);
    const caps = constructed.capabilities;
    assert.ok(caps.includes("document-classification"), "Missing classification");
    assert.ok(caps.includes("fact-extraction"), "Missing extraction");
    assert.ok(caps.includes("deadline-analysis"), "Missing deadline analysis");
    assert.ok(caps.includes("evidence-analysis"), "Missing evidence analysis");
    assert.ok(caps.includes("contradiction-analysis"), "Missing contradiction analysis");
    assert.ok(caps.includes("drafting"), "Missing drafting");
    assert.ok(caps.includes("draft-validation"), "Missing draft validation");
    assert.ok(caps.includes("mailing"), "Missing mailing");
    assert.ok(caps.includes("proof"), "Missing proof");
  });

  test("denied-claim has xray and stress-test capabilities", () => {
    const constructed = constructWorkflow(workflows["denied-claim"]);
    assert.ok(constructed.capabilities.includes("xray-analysis"), "Missing xray-analysis");
    assert.ok(constructed.capabilities.includes("timeline-analysis"), "Missing timeline-analysis");
    assert.ok(constructed.capabilities.includes("stress-testing"), "Missing stress-testing");
    assert.ok(constructed.capabilities.includes("response-strategy"), "Missing response-strategy");
  });

  test("factory validation summary has correct counts", () => {
    const all = constructAllWorkflows(workflows);
    const summary = factoryValidationSummary(all);
    assert.equal(summary.total, Object.keys(workflows).length);
    assert.ok(summary.ready > 0, "At least one workflow should be ready");
  });

  test("quality gate for denied-claim is mostly satisfied", () => {
    const constructed = constructWorkflow(workflows["denied-claim"]);
    const gate = constructed.qualityGate;
    assert.ok(gate.documentRecognition, "Document recognition should be true");
    assert.ok(gate.factGrounding, "Fact grounding should be true");
    assert.ok(gate.draftValidation, "Draft validation should be true");
    assert.ok(gate.submissionReadiness, "Submission readiness should be true");
  });

  test("non-registered workflows get warnings but still construct", () => {
    // government-decision doesn't have a domain pack registered
    const constructed = constructWorkflow(workflows["government-decision"]);
    assert.ok(constructed.warnings.length > 0, "Should have warnings for missing domain pack");
    assert.ok(constructed.ready, "Should still be ready (warnings are not errors)");
  });

  test("ALL_CAPABILITIES list has 15 capabilities", () => {
    assert.equal(ALL_CAPABILITIES.length, 15);
  });

  test("domain pack registration and retrieval works", () => {
    const testPack: DomainPackSet = {
      engine: "appeal",
      document: { name: "test", acceptedTypes: [], classifierHints: [], extractionSchema: [], minConfidence: 0.5 },
      deadline: { name: "test", triggeringEvents: [], sourcePriority: [], jurisdictionDependent: false, computationRules: [] },
      evidence: { name: "test", evidenceTypes: [], sufficiencyRules: [], contradictionRules: [], missingEvidenceBehavior: "" },
      analysis: { name: "test", capabilities: [], orderedChecks: [], riskFactors: [], outputSections: [] },
      draft: { name: "test", draftType: "", requiredSections: [], prohibitedUnsupportedClaims: [], toneRules: [] },
      validation: { name: "test", factualChecks: [], requirementChecks: [], unsupportedAssertionChecks: [], adversarialChecks: [] },
      submission: { name: "test", methods: [], recipientRules: [], supportsMailing: false, supportsTracking: false, proofRequirements: [] },
    };
    registerDomainPack("test-workflow", testPack);
    const retrieved = getDomainPack("test-workflow");
    assert.ok(retrieved, "Test pack should be retrievable");
    assert.equal(retrieved.engine, "appeal");
  });
});

describe("Executable vs Non-Executable Separation", () => {
  test("only denied-claim has domain pack", () => {
    const registeredIds = getRegisteredWorkflowIds();
    // Only denied-claim should have a domain pack at this stage
    assert.ok(registeredIds.includes("denied-claim"));
    // Other workflows don't have packs yet
    assert.ok(!registeredIds.includes("government-decision"));
    assert.ok(!registeredIds.includes("court-ruling"));
    assert.ok(!registeredIds.includes("reconsideration"));
  });

  test("non-registered workflows have blueprint or functional lifecycle", () => {
    for (const [id, def] of Object.entries(workflows)) {
      const constructed = constructWorkflow(def);
      if (id !== "denied-claim") {
        assert.equal(
          constructed.lifecycle,
          "blueprint",
          `Workflow ${id} should be blueprint lifecycle (no domain pack)`,
        );
      }
    }
  });

  test("denied-claim quality gate is better than others", () => {
    const insuranceGate = constructWorkflow(workflows["denied-claim"]).qualityGate;
    const otherGates = Object.entries(workflows)
      .filter(([id]) => id !== "denied-claim")
      .map(([, def]) => constructWorkflow(def).qualityGate);

    const insuranceTrueCount = Object.values(insuranceGate).filter(Boolean).length;
    for (const gate of otherGates) {
      const otherTrueCount = Object.values(gate).filter(Boolean).length;
      assert.ok(
        insuranceTrueCount >= otherTrueCount,
        "Insurance appeal should have at least as many quality gates satisfied",
      );
    }
  });
});
