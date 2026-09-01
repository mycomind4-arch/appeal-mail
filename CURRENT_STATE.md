# CURRENT_STATE.md — Appeal Mail

**Last updated:** 2026-09-01
**Base:** `main` (merged)

---

## Ground-truth baseline

This state reflects the merged production packet pipeline on `main`.

| Area | Ground truth on `main` |
|---|---|
| Tests | 810/813 passing (3 pre-existing failures: `$workflowId` API route regression, `packet-builder` `@/` alias in tsx, `recipient-persistence` — same failures with/without the merge) |
| Catalog entries | **41** |
| Catalog `IMPLEMENTED` / executable | **36** |
| Gold domain modules | **21** `*-gold.ts` modules |
| Workspace UI components | **31** |
| AI control plane | Multi-provider Anthropic/OpenAI/Gemini control-plane integration exists |
| Mailing client | `src/platform/mailmypdf.ts` is the single typed/idempotent mailing client |
| Auth | `/dashboard` is UI-gated and server operations use `src/lib/auth-guard.ts` |
| Document safety | Uploaded/extracted text is sanitized before AI use; MIME, filename, size, page, and PDF active-content checks exist |

## Production work merged to main

### Shared packet builder

`src/platform/packet-builder.ts` using `pdf-lib`.

Supports ordered packet parts:
- `ai_response` — properly paginated text with margins and headings
- `uploaded_document` — PDF page merging or PNG/JPEG image placement
- `generated_document` — PDF merging

Every part is hashed, the final draft receives a SHA-256 hash, and PDFs are scanned for blocked active-content tokens before merging.

### Authenticated packet assembly endpoint

`/api/packets/build`:
- requires server-side MailMyPDF/Supabase authentication
- verifies the authenticated user owns the appeal
- requires exactly one final AI-response part
- accepts ordered uploaded/generated packet parts and page operations (reorder, remove, rotate)
- requires and persists recipient fields (recipientName, recipientAddress1-2, recipientCity, recipientState, recipientZip, mailingMethod) with a recipientHash for integrity
- uploads source documents through the existing MailMyPDF document client
- assembles a single final PDF
- uploads the locked final packet through the same client
- persists packet document ID, hashes, order, source documents, page count, recipient, and confirmation user ID on the owned appeal
- marks the packet `locked: true` and `status: assembled`

### Generic Stripe fulfillment

The Stripe webhook no longer contains the five-workflow PDF whitelist and no longer calls `simple-pdf.ts`.

Paid fulfillment now requires:
- a locked, assembled packet
- a stored final-draft hash matching the current draft
- a stored packet document ID and document integrity hash
- complete recipient information (read from the locked packet, not Stripe metadata)

Fulfillment idempotency uses durable mailing-row checks (`provider_order_id` deduplication in Supabase) rather than in-memory event-key reservation, so failed fulfillment remains retryable across server restarts.

### Packet editor UI

`src/components/packet-editor.tsx` provides a reusable editor in the workflow workspace for packet part reordering and supporting-document insertion. Server-side page operations (reorder, remove, rotation) are supported.

### Dashboard APIs

Authenticated `/api/dashboard/cases` and `/api/dashboard/mailings` endpoints wired to real Supabase data, replacing placeholder dashboard tabs.

### Shared AI control-plane task runner

`src/platform/control-plane-ai.ts` centralizes provider configuration resolution. The dynamic workflow analysis route (`$workflowId/analyze`) now resolves provider configuration through the shared task runner.

### Tests

- `tests/packet-builder.test.ts` — PDF construction, hashing, removal, rotation
- `tests/webhook-idempotency.test.ts` — 9 tests covering reserve/release/store/dedup lifecycle (9/9 passing)
- `tests/recipient-persistence.test.ts` — 6 tests covering recipient hash determinism, field completeness, webhook reconstruction (6/6 passing)

### Removed

- `src/platform/simple-pdf.ts` — superseded hand-written text-only PDF writer

## Remaining production work

1. **Full PDF.js page-level editor** — the current PacketEditor operates on packet parts (one item per source document), not individual PDF pages. The server supports page-level operations but the UI does not yet render page-by-page thumbnails.
2. **AI revision integration** — manual draft edits are not yet connected to AI-assisted revision.
3. **Migrate all workflow AI routes** — some specialized workflow routes still contain provider-specific logic rather than using the shared control-plane task runner.
4. **CI verification** — the `.github/workflows/verify.yml` workflow exists but has not yet been run on the merged head. Run full `npm test`, `npm run build`, and lint in CI.
5. **Authenticated end-to-end verification** — verify the full packet → lock → payment → fulfillment path against live Supabase, Stripe, MailMyPDF, and control-plane credentials.

## Canonical architecture direction

`mailmypdf-platform` remains the shared runtime/pricing/fulfillment layer.

Appeal Mail owns the appeal domain catalog and domain packs, while reusable packet assembly, authenticated case/document persistence, and mailing should remain shared-pattern infrastructure rather than separate implementations for individual workflows.
