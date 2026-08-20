/* ═══════════════════════════════════════════════════════════
   WORKFLOW CAPABILITIES — capability packs and factory system
   for Appeal Mail, adapted from the Notice Respond gold-standard
   architecture.

   This module provides:
   - CapabilityPack definitions (what a workflow can do)
   - DomainPack interfaces (how a workflow specializes the engine)
   - Factory construction (validate → resolve → load → construct)
   - Quality gate evaluation

   The existing workflows.ts definitions remain the source of truth
   for workflow IDs and step labels. This layer adds the capability
   architecture on top.

   ═══════════════════════════════════════════════════════════ */

import type { WorkflowId, WorkflowDefinition } from "./workflows";

// ── Capability Packs ──────────────────────────────────────────

export type CapabilityPack =
  | "document-classification"
  | "fact-extraction"
  | "deadline-analysis"
  | "evidence-analysis"
  | "contradiction-analysis"
  | "xray-analysis"
  | "timeline-analysis"
  | "stress-testing"
  | "response-strategy"
  | "drafting"
  | "draft-validation"
  | "readiness-review"
  | "submission"
  | "mailing"
  | "proof";

export const ALL_CAPABILITIES: readonly CapabilityPack[] = [
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

// ── Lifecycle ─────────────────────────────────────────────────

export type WorkflowLifecycle = "blueprint" | "functional" | "authority";

// ── Document Pack ─────────────────────────────────────────────

export interface DocumentPack {
  name: string;
  acceptedTypes: string[];
  classifierHints: string[];
  extractionSchema: string[];
  minConfidence: number;
}

// ── Deadline Pack ─────────────────────────────────────────────

export interface DeadlinePack {
  name: string;
  triggeringEvents: string[];
  sourcePriority: string[];
  jurisdictionDependent: boolean;
  computationRules: string[];
}

// ── Evidence Pack ─────────────────────────────────────────────

export interface EvidencePack {
  name: string;
  evidenceTypes: string[];
  sufficiencyRules: string[];
  contradictionRules: string[];
  missingEvidenceBehavior: string;
}

// ── Analysis Pack ─────────────────────────────────────────────

export interface AnalysisPack {
  name: string;
  capabilities: CapabilityPack[];
  orderedChecks: string[];
  riskFactors: string[];
  outputSections: string[];
}

// ── Draft Pack ───────────────────────────────────────────────

export interface DraftPack {
  name: string;
  draftType: string;
  requiredSections: string[];
  prohibitedUnsupportedClaims: string[];
  toneRules: string[];
}

// ── Validation Pack ──────────────────────────────────────────

export interface ValidationPack {
  name: string;
  factualChecks: string[];
  requirementChecks: string[];
  unsupportedAssertionChecks: string[];
  adversarialChecks: string[];
}

// ── Submission Pack ──────────────────────────────────────────

export interface SubmissionPack {
  name: string;
  methods: string[];
  recipientRules: string[];
  supportsMailing: boolean;
  supportsTracking: boolean;
  proofRequirements: string[];
}

// ── Domain Pack Set ───────────────────────────────────────────

export interface DomainPackSet {
  engine: "appeal";
  document: DocumentPack;
  deadline: DeadlinePack;
  evidence: EvidencePack;
  analysis: AnalysisPack;
  draft: DraftPack;
  validation: ValidationPack;
  submission: SubmissionPack;
}

// ── Pack Registry ─────────────────────────────────────────────

const PACK_REGISTRY: Record<string, DomainPackSet> = {};

export function registerDomainPack(workflowId: string, pack: DomainPackSet): void {
  PACK_REGISTRY[workflowId] = pack;
}

export function getDomainPack(workflowId: string): DomainPackSet | undefined {
  return PACK_REGISTRY[workflowId];
}

export function getRegisteredWorkflowIds(): string[] {
  return Object.keys(PACK_REGISTRY);
}

// ── Quality Gate ──────────────────────────────────────────────

export interface QualityGate {
  documentRecognition: boolean;
  factGrounding: boolean;
  deadlineVerification: boolean;
  evidenceGrounding: boolean;
  draftValidation: boolean;
  submissionReadiness: boolean;
  proofReady: boolean;
}

// ── Constructed Workflow ─────────────────────────────────────

export interface ConstructedWorkflow {
  definition: WorkflowDefinition;
  capabilities: CapabilityPack[];
  packs: DomainPackSet | undefined;
  qualityGate: QualityGate;
  lifecycle: WorkflowLifecycle;
  warnings: string[];
  errors: string[];
  ready: boolean;
}

// ── Factory Pipeline ──────────────────────────────────────────

export function validateDefinition(def: WorkflowDefinition): string[] {
  const errors: string[] = [];
  if (!def.id) errors.push("Missing workflow id");
  if (!def.title) errors.push("Missing title");
  if (!def.description) errors.push("Missing description");
  if (!def.steps?.length) errors.push("No workflow steps");
  if (!def.stepLabels?.length) errors.push("No step labels");
  if (def.steps.length !== def.stepLabels.length) errors.push("Steps and labels count mismatch");
  if (!def.decisionFields?.length) errors.push("No decision field definitions");
  if (!def.focusAreas?.length) errors.push("No focus areas");
  return errors;
}

export function loadCapabilities(def: WorkflowDefinition, packs?: DomainPackSet): CapabilityPack[] {
  const caps = new Set<CapabilityPack>();

  // Base capabilities for all appeal workflows
  caps.add("document-classification");
  caps.add("fact-extraction");
  caps.add("deadline-analysis");
  caps.add("evidence-analysis");
  caps.add("contradiction-analysis");
  caps.add("drafting");
  caps.add("draft-validation");
  caps.add("readiness-review");
  caps.add("submission");
  caps.add("mailing");
  caps.add("proof");

  // Add capabilities from domain pack analysis
  if (packs?.analysis?.capabilities) {
    for (const cap of packs.analysis.capabilities) caps.add(cap);
  }

  // Add capabilities based on workflow steps
  if (def.steps.includes("xray")) caps.add("xray-analysis");
  if (def.steps.includes("timeline")) caps.add("timeline-analysis");
  if (def.steps.includes("stress-test")) caps.add("stress-testing");
  if (def.steps.includes("final-stress-test")) caps.add("stress-testing");

  return Array.from(caps);
}

export function evaluateQualityGate(
  def: WorkflowDefinition,
  packs?: DomainPackSet,
): QualityGate {
  const hasDoc = !!packs?.document;
  const hasEvidence = !!packs?.evidence;
  const hasDraft = !!packs?.draft;
  const hasValidation = !!packs?.validation;
  const hasSubmission = !!packs?.submission;

  return {
    documentRecognition: hasDoc,
    factGrounding: hasDoc,
    deadlineVerification: hasDoc,
    evidenceGrounding: hasEvidence,
    draftValidation: hasValidation,
    submissionReadiness: hasSubmission && hasDraft,
    proofReady: hasSubmission,
  };
}

export function determineLifecycle(gate: QualityGate): WorkflowLifecycle {
  const allPassed = Object.values(gate).every(Boolean);
  if (allPassed) return "authority";
  const somePassed = Object.values(gate).some(Boolean);
  if (somePassed) return "functional";
  return "blueprint";
}

export function constructWorkflow(def: WorkflowDefinition): ConstructedWorkflow {
  const warnings: string[] = [];
  const errors: string[] = [];

  // Step 1: Validate definition
  const validationErrors = validateDefinition(def);
  errors.push(...validationErrors);

  // Step 2: Load domain packs
  const packs = getDomainPack(def.id);
  if (!packs) {
    warnings.push(`No domain pack set registered for ${def.id} — using definition defaults`);
  }

  // Step 3: Load capabilities
  const capabilities = loadCapabilities(def, packs);

  // Step 4: Evaluate quality gate
  const qualityGate = evaluateQualityGate(def, packs);
  const lifecycle = determineLifecycle(qualityGate);

  // Step 5: Lifecycle checks
  if (lifecycle === "blueprint") {
    warnings.push(`Workflow ${def.id} has no domain packs — quality gate is all false`);
  }

  return {
    definition: def,
    capabilities,
    packs,
    qualityGate,
    lifecycle,
    warnings,
    errors,
    ready: errors.length === 0,
  };
}

export function constructAllWorkflows(
  definitions: Record<WorkflowId, WorkflowDefinition>,
): ConstructedWorkflow[] {
  return Object.values(definitions).map(constructWorkflow);
}

export function factoryValidationSummary(workflows: ConstructedWorkflow[]): {
  total: number;
  ready: number;
  withErrors: number;
  withWarnings: number;
  authorityCount: number;
  functionalCount: number;
  blueprintCount: number;
  errors: { workflowId: string; errors: string[] }[];
  warnings: { workflowId: string; warnings: string[] }[];
} {
  return {
    total: workflows.length,
    ready: workflows.filter((w) => w.ready).length,
    withErrors: workflows.filter((w) => w.errors.length > 0).length,
    withWarnings: workflows.filter((w) => w.warnings.length > 0).length,
    authorityCount: workflows.filter((w) => w.lifecycle === "authority").length,
    functionalCount: workflows.filter((w) => w.lifecycle === "functional").length,
    blueprintCount: workflows.filter((w) => w.lifecycle === "blueprint").length,
    errors: workflows
      .filter((w) => w.errors.length > 0)
      .map((w) => ({ workflowId: w.definition.id, errors: w.errors })),
    warnings: workflows
      .filter((w) => w.warnings.length > 0)
      .map((w) => ({ workflowId: w.definition.id, warnings: w.warnings })),
  };
}
