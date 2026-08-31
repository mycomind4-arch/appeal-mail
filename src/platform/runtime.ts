/**
 * Bridge between appeal-mail and @mailmypdf/runtime.
 *
 * Exports the shared runtime contracts adapted for appeal-mail's domain.
 * This replaces the hand-rolled audit, approval, and verification logic
 * with the canonical implementations from @mailmypdf/runtime.
 */

import {
  computeEventHash,
  createAuditEntry,
  verifyAuditChain,
  GENESIS_HASH,
  type AuditChainEntry,
} from "@mailmypdf/runtime";
import {
  canTransition,
  isTerminal,
  isPreApproval,
  isPostApproval,
  requiresApprovalGate,
  type CaseState,
} from "@mailmypdf/runtime";
import {
  createMemoryIdempotencyStore,
  fulfillmentKey,
  webhookKey,
  paymentKey,
  type IdempotencyStore,
} from "@mailmypdf/runtime";
import {
  signWebhook,
  verifyWebhook,
  processFulfillmentWebhook,
} from "@mailmypdf/runtime";
import {
  attestDocument,
  verifyDocumentIntegrity,
} from "@mailmypdf/runtime";

/* ── Audit Chain ──
 * Tamper-evident audit chain from @mailmypdf/runtime.
 * Replaces the hand-rolled audit event recording in appeal-repository.ts.
 *
 * The chain is stored in the existing audit_events table, with the
 * hash chain fields (eventHash, previousHash, sequence) embedded in
 * the metadata JSONB column. This avoids schema migrations while
 * still providing tamper-evidence.
 */

export interface AuditChainInput {
  caseId: string;
  sequence: number;
  eventType: string;
  actor: "user" | "system" | "ai" | "external";
  actorId?: string;
  payload: Record<string, unknown>;
  previousHash: string;
}

export async function createTamperEvidentAuditEntry(
  input: AuditChainInput,
): Promise<AuditChainEntry> {
  return createAuditEntry({
    caseId: input.caseId as any,
    sequence: input.sequence,
    eventType: input.eventType,
    actor: input.actor,
    actorId: input.actorId,
    payload: input.payload,
    previousHash: input.previousHash,
  });
}

export { verifyAuditChain, GENESIS_HASH, computeEventHash, type AuditChainEntry };

/* ── Case Lifecycle ── */

export {
  canTransition,
  isTerminal,
  isPreApproval,
  isPostApproval,
  requiresApprovalGate,
  type CaseState,
};

/* ── Idempotency ── */

const _idempotencyStore = createMemoryIdempotencyStore();
export { _idempotencyStore as idempotencyStore, type IdempotencyStore };
export { fulfillmentKey, webhookKey, paymentKey };

/* ── Webhook Verification ── */

export { signWebhook, verifyWebhook, processFulfillmentWebhook };

/* ── Document Integrity ── */

export { attestDocument, verifyDocumentIntegrity };

/* ── Approval Gate Enforcement ──
 * Maps appeal-mail's status strings to the runtime's CaseState
 * and enforces the state machine before approval transitions.
 */

const STATUS_TO_CASE_STATE: Record<string, CaseState> = {
  created: "draft",
  analyzed: "validated",
  drafted: "review",
  reviewed: "review",
  ready: "approved",
  paid: "queued",
  mailed: "submitted",
  in_transit: "tracking",
  delivered: "completed",
  failed: "failed",
  cancelled: "cancelled",
};

/** Map an appeal's status string to the runtime's CaseState. */
export function toCaseState(status: string): CaseState {
  return STATUS_TO_CASE_STATE[status] ?? "draft";
}

/** Check whether transitioning from the current status to "ready" (approved) is valid. */
export function canApprove(currentStatus: string): boolean {
  const from = toCaseState(currentStatus);
  return canTransition(from, "approved");
}
