# WORKFLOW_CATALOG.md — Appeal Mail

**Last reconciled:** 2026-09-01
**Source of truth:** `src/domain/appeal-catalog.ts` and the executable route/component tree. This file is a human-readable snapshot, not the authoritative registry.

## Ground truth

The `main` codebase contains **41 catalog entries**. **36 are marked `IMPLEMENTED` and `executable: true`; 5 are `COMING_SOON` / non-executable.**

The prior documentation claim of 20 workflows is stale and must not be used for release decisions.

## Production interpretation

`IMPLEMENTED` means the catalog marks the workflow executable. It does **not** by itself prove a complete end-to-end production flow.

Additional distinctions:
- 21 `*-gold.ts` domain modules exist.
- 31 workspace UI components exist.
- A real multi-provider control-plane AI layer exists.
- The mailing client is production-shaped and idempotent.
- Before the production-packet work, only five workflow IDs were actually wired to PDF+mail fulfillment in the Stripe webhook.
- Final packet assembly is now generalized — a locked, user-confirmed packet can be mailed for any executable workflow via the shared `/api/packets/build` endpoint and generic Stripe fulfillment.

## Canonical release pipeline

Every executable workflow must ultimately use the same contract:

**Authenticated intake → source/document analysis → AI-assisted analysis → AI draft → validation → user edit/review → ordered packet assembly → packet lock → payment → authenticated fulfillment → tracking → proof**

Workflow-specific differences belong in domain packs and workflow configuration, not copied fulfillment pipelines.

## Production-packet work merged to main

Merged 2026-09-01:
- `src/platform/packet-builder.ts` — pdf-lib packet assembly with page operations
- authenticated `/api/packets/build` — ownership checks, recipient persistence, ordered parts
- generalized Stripe fulfillment against the locked packet document
- packet integrity hashes, recipient hash, and ordered-part metadata
- durable webhook idempotency via Supabase mailing-row checks
- packet-builder, webhook-idempotency, and recipient-persistence tests
- packet editor UI component in the workflow workspace
- authenticated dashboard APIs for cases and mailings

## Remaining work

1. Full PDF.js page-level editor (current editor operates on packet parts, not individual pages).
2. AI revision integration for manual draft edits.
3. Migrate all workflow-specific AI routes to the shared control-plane task runner.
4. CI-verified test/build/lint run on the merged head.
5. Authenticated end-to-end verification against live services.

## Required final documentation pass

After the shared workflow pipeline is fully wired, regenerate this document from the catalog and executable route tree. Keep the catalog source authoritative and avoid maintaining independent workflow counts in multiple status files.
