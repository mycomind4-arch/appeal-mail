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
