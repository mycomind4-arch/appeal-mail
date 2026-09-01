import { APPEAL_CATALOG } from "@/domain/appeal-catalog";
import { workflows, type WorkflowDefinition } from "@/domain/workflows";

const COMMON_STEPS: WorkflowDefinition["steps"] = [
  "intro", "document", "xray", "decision", "timeline", "grounds", "evidence",
  "arguments", "stress-test", "draft", "final-stress-test", "readiness", "packet",
  "recipient", "mailing", "checkout", "proof", "submitted",
];

const COMMON_LABELS = [
  "Start", "Document", "X-Ray", "Decision", "Timeline", "Grounds", "Evidence",
  "Arguments", "Stress Test", "Draft", "Final Test", "Readiness", "Packet", "Recipient",
  "Mailing", "Checkout", "Proof", "Done",
];

/**
 * Reconciles the SEO/catalog registry with the executable workflow registry.
 * Existing specialized definitions always win; missing catalog targets receive
 * a safe document-first definition so the dynamic workflow route and API can
 * still resolve them instead of failing with "Workflow not found".
 */
for (const entry of APPEAL_CATALOG) {
  const workflowId = entry.workflowRoute.replace(/^\/workflows\//, "");
  if (workflows[workflowId]) continue;

  workflows[workflowId] = {
    id: workflowId,
    title: entry.title,
    description: entry.shortDescription,
    disclaimer: "Appeal Mail provides document preparation and mailing assistance. It is not a law firm and does not provide legal advice.",
    steps: COMMON_STEPS,
    stepLabels: COMMON_LABELS,
    decisionFields: [
      { key: "referenceNumber", label: "Reference / Case Number", type: "text" },
      { key: "agency", label: "Decision-maker / Company", type: "text" },
      { key: "decisionDate", label: "Decision Date", type: "date" },
      { key: "deadline", label: "Response / Appeal Deadline", type: "date" },
    ],
    focusAreas: [...entry.whatWeAnalyze],
    deadlineWarning: "Check the source document carefully for the response or appeal deadline.",
    experienceStages: ["understand", "build", "send"],
    primaryKeyword: entry.primaryKeyword,
    keywordIntent: "transactional",
    workflowPrompt: [
      entry.shortDescription,
      `Analyze the source document for the workflow: ${entry.title}.`,
      `Focus on: ${entry.whatWeAnalyze.join(", ")}.`,
      `The user may provide: ${entry.whatYouNeed.join(", ")}.`,
      "Use only supplied or source-grounded facts. Never invent dates, amounts, law, policy terms, medical facts, deadlines, or outcomes.",
      "Return a review-ready result and clearly identify uncertainty and missing evidence.",
    ].join("\n"),
    acceptsDocuments: true,
  };
}

export function resolveWorkflow(workflowId: string): WorkflowDefinition | undefined {
  return workflows[workflowId];
}

export function isResolvedWorkflowId(value: string): value is string {
  return Boolean(workflows[value]);
}
