# WORKFLOW_CATALOG.md — Appeal Mail

**Last reconciled:** 2026-09-01
**Source of truth:** `src/domain/appeal-catalog.ts` and the executable route/component tree. This file is a human-readable snapshot, not the authoritative registry.

## Ground truth

The audited `main` codebase contains **41 catalog entries**. **36 are marked `IMPLEMENTED` and `executable: true`; 5 are `COMING_SOON` / non-executable.**

The prior documentation claim of 20 workflows is stale and must not be used for release decisions.

## Production interpretation

`IMPLEMENTED` means the catalog marks the workflow executable. It does **not** by itself prove a complete end-to-end production flow.

The 2026-08-31 audit found these additional distinctions:
- 21 `*-gold.ts` domain modules exist.
- 31 workspace UI components exist.
- A real multi-provider control-plane AI layer exists.
- The existing mailing client is production-shaped and idempotent.
- Before the production-packet work, only five workflow IDs were actually wired to PDF+mail fulfillment in the Stripe webhook.
- Final packet assembly is being generalized so a locked user-confirmed packet can be mailed for any executable workflow.

## Canonical release pipeline

Every executable workflow must ultimately use the same contract:

**Authenticated intake → source/document analysis → AI-assisted analysis → AI draft → validation → user edit/review → ordered packet assembly → packet lock → payment → authenticated fulfillment → tracking → proof**

Workflow-specific differences belong in domain packs and workflow configuration, not copied fulfillment pipelines.

## Current implementation branch

`feat/production-packet-pipeline` adds:
- `src/platform/packet-builder.ts`
- authenticated `/api/packets/build`
- generalized Stripe fulfillment against a locked packet document
- packet integrity hashes and ordered-part metadata
- packet-builder tests

The branch has not yet had its dependency lockfile regenerated or CI-executed in this environment.

## Required final documentation pass

After the shared workflow pipeline is fully wired, regenerate this document from the catalog and executable route tree. Keep the catalog source authoritative and avoid maintaining independent workflow counts in multiple status files.
