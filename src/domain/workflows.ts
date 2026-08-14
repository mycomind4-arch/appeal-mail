import { z } from "zod";

/* ─────────────────────────────────────────────
   Workflow definitions — now with specialized
   steps, fields, and intelligence focus per
   workflow type.
   ───────────────────────────────────────────── */

export type WorkflowId = "denied-claim" | "government-decision" | "court-ruling" | "reconsideration";

/* Extended step types — the old wizard is now an intelligence pipeline */
export type WorkflowStep =
  | "intro"
  | "document"       // upload + extract
  | "xray"           // Appeal X-Ray cross-document analysis
  | "decision"        // review extracted decision facts
  | "timeline"        // chronology of events
  | "grounds"         // define appeal grounds
  | "evidence"        // manage evidence + link to grounds
  | "arguments"       // construct arguments
  | "draft"           // AI-assisted draft generation
  | "readiness"       // automated readiness review
  | "packet"           // assemble final packet
  | "recipient"       // who to mail to
  | "mailing"         // choose mailing method
  | "checkout"        // payment
  | "proof"           // permanent proof record
  | "submitted";

export interface WorkflowFieldDef {
  key: string;
  label: string;
  placeholder?: string;
  type: "text" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
}

export interface WorkflowDefinition {
  id: WorkflowId;
  title: string;
  description: string;
  disclaimer: string;
  steps: WorkflowStep[];
  stepLabels: string[];
  /* Specialized fields for the decision identification step */
  decisionFields: WorkflowFieldDef[];
  /* What this workflow focuses on */
  focusAreas: string[];
  /* Deadline urgency message */
  deadlineWarning: string;
}

const COMMON_STEPS: WorkflowStep[] = [
  "intro", "document", "xray", "decision", "timeline", "grounds", "evidence",
  "arguments", "draft", "readiness", "packet", "recipient", "mailing",
  "checkout", "proof", "submitted",
];

const COMMON_LABELS = [
  "Start", "Document", "X-Ray", "Decision", "Timeline", "Grounds", "Evidence",
  "Arguments", "Draft", "Readiness", "Packet", "Recipient", "Mailing",
  "Checkout", "Proof", "Done",
];

export const workflows: Record<WorkflowId, WorkflowDefinition> = {
  "government-decision": {
    id: "government-decision",
    title: "Appeal a Government Decision",
    description: "Prepare an appeal for a denied government benefit, licensing decision, or agency ruling.",
    disclaimer:
      "Government appeal processes have strict deadlines and specific requirements. Review the appeal instructions carefully. Appeal Mail is not a law firm.",
    steps: COMMON_STEPS,
    stepLabels: COMMON_LABELS,
    focusAreas: [
      "Agency identification and jurisdiction",
      "Administrative deadline compliance",
      "Appeal instructions extraction",
      "Regulatory basis for the decision",
      "Hearing or review rights",
    ],
    deadlineWarning:
      "Government appeal deadlines can be very short — sometimes 10–30 days. Note your deadline immediately.",
    decisionFields: [
      { key: "agency", label: "Agency / Body", placeholder: "e.g., SSA, VA, DMV, Licensing Board", type: "text", required: true },
      { key: "referenceNumber", label: "Reference / Case Number", type: "text" },
      { key: "decisionTypeLabel", label: "Decision Type", placeholder: "Benefit denial, license revocation, etc.", type: "text" },
      { key: "decisionDate", label: "Decision Date", type: "date" },
      { key: "deadline", label: "Appeal Deadline", type: "date" },
    ],
  },
  "denied-claim": {
    id: "denied-claim",
    title: "Appeal a Denied Claim",
    description:
      "Prepare an appeal letter for a denied insurance claim, benefit denial, or workers' compensation decision.",
    disclaimer:
      "Appeal Mail provides document preparation and mailing assistance. It is not a law firm and does not provide legal advice. Appeal deadlines can be very short — note yours immediately.",
    steps: COMMON_STEPS,
    stepLabels: COMMON_LABELS,
    focusAreas: [
      "Denial reason extraction",
      "Policy or claim reference identification",
      "Supporting records and documentation",
      "Disputed facts and discrepancies",
      "Requested reconsideration outcome",
    ],
    deadlineWarning:
      "Claim appeal deadlines vary by insurer and jurisdiction. Some are as short as 30–60 days. Check your denial letter.",
    decisionFields: [
      { key: "referenceNumber", label: "Claim / Case Number", type: "text", required: true },
      { key: "agency", label: "Insurer / Provider", placeholder: "e.g., Blue Cross, State Farm", type: "text" },
      { key: "decisionTypeLabel", label: "Claim Type", placeholder: "Medical, auto, workers' comp, etc.", type: "text" },
      { key: "decisionDate", label: "Denial Date", type: "date" },
      { key: "deadline", label: "Appeal Deadline", type: "date" },
    ],
  },
  "court-ruling": {
    id: "court-ruling",
    title: "Appeal a Court Ruling",
    description: "Prepare an appeal for a small claims, traffic, or municipal court decision.",
    disclaimer:
      "Court appeals have strict procedural requirements and short deadlines. Consult an attorney if you are unsure. Appeal Mail is not a law firm.",
    steps: COMMON_STEPS,
    stepLabels: COMMON_LABELS,
    focusAreas: [
      "Jurisdiction and court identification",
      "Order or judgment date",
      "Procedural filing requirements",
      "Filing deadline computation",
      "Court destination and format",
    ],
    deadlineWarning:
      "Court appeal deadlines are extremely strict — often 10–30 days from the ruling. Missing the deadline usually means losing the right to appeal.",
    decisionFields: [
      { key: "agency", label: "Court Name", placeholder: "e.g., Superior Court of California", type: "text", required: true },
      { key: "referenceNumber", label: "Case Number", type: "text", required: true },
      { key: "decisionTypeLabel", label: "Ruling Type", placeholder: "Judgment, order, conviction, etc.", type: "text" },
      { key: "decisionDate", label: "Ruling Date", type: "date" },
      { key: "deadline", label: "Filing Deadline", type: "date" },
    ],
  },
  "reconsideration": {
    id: "reconsideration",
    title: "Submit a Reconsideration Request",
    description: "Request an internal review or reconsideration before filing a formal appeal.",
    disclaimer:
      "Reconsideration requests may have different deadlines than formal appeals. Check the instructions from the decision-maker. Appeal Mail is not a law firm.",
    steps: COMMON_STEPS,
    stepLabels: COMMON_LABELS,
    focusAreas: [
      "New information identification",
      "Factual error documentation",
      "Omitted evidence presentation",
      "Internal review process navigation",
      "Outcome specification",
    ],
    deadlineWarning:
      "Reconsideration deadlines can be shorter than formal appeal deadlines. Check the instructions from the decision-maker.",
    decisionFields: [
      { key: "agency", label: "Decision-Maker / Agency", placeholder: "e.g., SSA, Insurance Company", type: "text", required: true },
      { key: "referenceNumber", label: "Reference / Claim Number", type: "text" },
      { key: "decisionTypeLabel", label: "Original Decision", placeholder: "Denial, termination, overpayment, etc.", type: "text" },
      { key: "decisionDate", label: "Decision Date", type: "date" },
      { key: "deadline", label: "Reconsideration Deadline", type: "date" },
    ],
  },
};

export const workflowIds = Object.keys(workflows) as WorkflowId[];

export function getWorkflow(id: WorkflowId): WorkflowDefinition {
  return workflows[id];
}
