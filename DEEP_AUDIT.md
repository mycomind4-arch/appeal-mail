# DEEP_AUDIT.md — Appeal Mail

**Date:** 2026-08-19
**Auditor:** Implementation Agent (no subagents)
**Repository:** https://github.com/mycomind4-arch/appeal-mail
**Branch:** main
**Commit:** c4055fe0

---

## 1. Current Architecture

### Stack
- **Framework:** TanStack Start (React 19 + TanStack Router + Vite 8)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **State:** React state (no global store) — workflow wizard holds all state in component
- **Persistence:** Supabase (Postgres + Auth + Storage)
- **Payments:** Stripe (checkout sessions, webhook)
- **Mailing:** MailMyPDF fulfillment API (via platform adapter)
- **Document Processing:** pdfjs-dist (client-side PDF text extraction)
- **Testing:** Node.js built-in test runner (`node --test`)
- **Deployment:** Cloudflare Workers (via Nitro)

### Project Structure
```
src/
├── components/
│   ├── workspace/app-shell.tsx       # Persistent sidebar layout
│   ├── workflow/workflow-wizard.tsx   # 1512-line monolith — all workflow logic
│   ├── xray/xray-view.tsx             # X-Ray findings display
│   ├── stress-test/stress-test-view.tsx # Stress test display
│   └── timeline/timeline-view.tsx     # Timeline display
├── domain/                            # Pure domain logic (no I/O)
│   ├── appeal.ts                      # Central entity (Zod schema)
│   ├── decision.ts                    # Decision model + extraction types
│   ├── ground.ts                      # Appeal ground types
│   ├── evidence.ts                    # Evidence + evidence links
│   ├── argument.ts                    # Argument construction
│   ├── review.ts                      # Readiness review
│   ├── packet.ts                      # Appeal packet assembly
│   ├── proof.ts                       # Proof packet (SHA-256)
│   ├── xray.ts                        # X-Ray analysis engine (~500 lines)
│   ├── stress-test.ts                 # Stress test engine
│   ├── timeline.ts                    # Timeline reconstruction
│   ├── workflows.ts                   # 4 workflow definitions
│   └── mailing.ts                     # Mailing domain types
├── platform/                          # Server functions + external integrations
│   ├── supabase.ts                    # Supabase client
│   ├── appeal-repository.ts           # Ownership-aware persistence
│   ├── checkout-fn.ts                 # Stripe checkout
│   ├── document-extraction.ts         # Pattern-matching extraction
│   ├── text-extraction.ts            # Client-side file → text
│   ├── xray-fn.ts                     # X-Ray server function
│   ├── stress-test-fn.ts              # Stress test server function
│   ├── timeline-fn.ts                 # Timeline HTTP handler
│   ├── extract-fn.ts                  # Decision extraction server fn
│   ├── mailmypdf.ts                   # MailMyPDF API types
│   ├── mailmypdf-provider.ts          # MailMyPDF fulfillment adapter
│   └── intelligence-adapter.ts        # Platform intelligence bridge
├── lib/platform/                      # Platform primitives (copied from mailmypdf-platform)
│   ├── core.ts                        # Result type, branded IDs, error hierarchy
│   ├── documents.ts                   # MIME validation, PDF safety, content sanitization
│   └── intelligence.ts                # Provenance, rate limiting, audit events
└── routes/
    ├── index.tsx                      # Landing page (rich, well-structured)
    ├── dashboard.tsx                  # Mailing history
    ├── auth.tsx                       # Supabase auth
    ├── workflows.tsx                 # Workflow directory
    ├── workflows/denied-claim.tsx     # → WorkflowWizard
    ├── workflows/government-decision.tsx
    ├── workflows/court-ruling.tsx
    ├── workflows/reconsideration.tsx
    ├── appeal-a-decision.tsx          # Search-intent landing
    ├── pricing.tsx, about.tsx, contact.tsx, faq.tsx
    ├── privacy.tsx, terms.tsx
    ├── resources/index.tsx, resources/$slug.tsx
    └── api/stripe-webhook.ts
```

### Domain Models
- **Appeal** — central entity with Zod schema. Contains: decision, grounds, evidence, arguments, draft, review, packet, proof, timeline
- **Decision** — what's being appealed. Facts, reasons, cited rules, deadline, chronology, issues
- **AppealGround** — 8 ground types (factual_error, procedural_error, legal_error, new_evidence, insufficient_weight, misapplied_rule, contradictory_finding, incomplete_review)
- **Evidence** — 6 types (document, excerpt, testimonial, photographic, record, correspondence)
- **XRayFinding** — 8 finding types with source refs, confidence, suggested grounds
- **EvidenceGap** — gaps linked to findings
- **TimelineEvent** — 5 integrity statuses, 8 categories, date precision, provenance

---

## 2. Current Production Execution Path

```
User lands on / → selects workflow → /workflows/{id}
  → WorkflowWizard component (1512 lines)
    → Step 1: Upload decision document (pdfjs-dist text extraction)
    → Step 2: X-Ray analysis (runXRayAnalysis — deterministic pattern matching)
    → Step 3: Review extracted decision facts
    → Step 4: Timeline reconstruction (buildTimeline)
    → Step 5: Build appeal grounds (manual or from X-Ray findings)
    → Step 6: Link evidence to grounds
    → Step 7: Construct arguments
    → Step 8: Stress test (runStressTest — adversarial analysis)
    → Step 9: Generate draft (template-based, grounds → paragraphs)
    → Step 10: Final stress test on draft
    → Step 11: Readiness review (runReadinessReview — score + issues)
    → Step 12: Assemble packet
    → Step 13: Enter recipient
    → Step 14: Choose mail type
    → Step 15: Checkout (Stripe)
    → Step 16: Proof packet
    → Step 17: Done
```

**What works:**
- Text extraction from PDFs (client-side pdfjs-dist)
- Decision extraction (pattern-matching for dates, reference numbers, agency names, deadlines)
- X-Ray cross-document analysis (date conflicts, unaddressed evidence, unsupported conclusions, contradictions)
- Timeline reconstruction with integrity statuses
- Stress test (ground attacks, strength profiles, weakest link)
- Draft generation (template-based from grounds + evidence)
- Readiness review (scoring + blocking issues)
- Proof packet (SHA-256 hash + certificate)
- Stripe checkout integration
- Supabase persistence with ownership-aware repository

**What doesn't work / is incomplete:**
- Build succeeds but has a stale `pdfjs-dist` resolution warning
- No server-side draft validation (no two-pass validator like Notice Respond)
- No draft provenance tracking (unsupported claims can pass silently)
- No physical-mail side-effect gate (idempotency key exists in types but not enforced server-side)
- Mailing is a placeholder — `createCheckoutSession` creates a Stripe session but the actual MailMyPDF fulfillment call is not wired through a server function
- No security validation on uploaded document content (sanitization exists in `lib/platform/documents.ts` but `text-extraction.ts` only uses filename/size validation, not content sanitization)
- The `stripe-webhook.ts` route doesn't export a Route (warning in build)
- No tests for X-Ray, stress test, timeline, or draft generation
- No tests for security, authorization, or mailing gates

---

## 3. Existing Appeal Intelligence

### X-Ray Engine (`src/domain/xray.ts` — ~500 lines)
**Strengths:**
- 8 finding types: date_conflict, unaddressed_evidence, unsupported_conclusion, contradiction, procedural_issue, factual_discrepancy, missing_reference, strength
- Each finding has: source refs, claims, confidence, suggested ground type, suggested claim text
- Evidence gap detection with severity levels
- Appeal map (visual flow structure: decision → reasons → weaknesses → facts → evidence → grounds → outcomes)
- Document summary extraction (dates, entities, role)

**Detection logic:**
- Date conflicts: cross-document date comparison near same keywords (received, submitted, filed, etc.)
- Unaddressed evidence: keyword overlap between decision reasons and evidence documents
- Unsupported conclusions: decision makes claims not found in any uploaded document
- Factual discrepancies: entity/reference number mismatches
- Missing references: decision cites documents not uploaded

**Weaknesses:**
- No two-pass validation (findings are generated but never validated against the draft)
- No provenance tracking from finding → draft claim
- No blocking status on findings
- No authoritative source citations
- No evidence graph (document → fact → finding → recommendation → draft)

### Stress Test Engine (`src/domain/stress-test.ts`)
**Strengths:**
- Ground attacks (how decision-maker could counter each ground)
- Strength profiles (0-100 scoring per ground)
- Weakest link identification
- Evidence gap analysis
- Overall assessment

**Weaknesses:**
- No draft vulnerability scanning (exaggeration, unsupported claims)
- No blocking/fail-closed validation

### Timeline Engine (`src/domain/timeline.ts`)
**Strengths:**
- 5 integrity statuses: documented, inferred, conflicting, missing, unknown
- 8 event categories
- Date precision tracking
- Conflict detection with alternative explanations
- One-click "Add to Appeal" from timeline conflicts

---

## 4. Existing Reusable Infrastructure

### From `lib/platform/` (copied from mailmypdf-platform):
- `core.ts`: Result type, branded IDs, typed error hierarchy, rate limiter
- `documents.ts`: MIME validation, PDF security (forbidden tokens), filename sanitization, content sanitization (prompt injection defense)
- `intelligence.ts`: Provenance levels (6 tiers), evidence evaluation, contradiction detection, case assessment, audit events

### From `platform/`:
- `appeal-repository.ts`: Ownership-aware persistence with optimistic concurrency, audit trail
- `checkout-fn.ts`: Stripe checkout with price mapping
- `text-extraction.ts`: Client-side PDF/image/text extraction with validation
- `document-extraction.ts`: Pattern-matching decision extraction (dates, references, agency, deadlines, reasons, appeal instructions)

### From `domain/`:
- Complete appeal domain model (Zod-validated)
- X-Ray analysis engine
- Stress test engine
- Timeline engine
- Evidence model with typed links
- Ground model with 8 types
- Packet assembly
- Proof packet (SHA-256)

---

## 5. Connected vs Disconnected Capabilities

| Capability | Implemented | Wired to UI | Server-Side | Tested |
|---|---|---|---|---|
| Document upload | ✓ | ✓ | ✗ (client-side only) | ✗ |
| Text extraction | ✓ | ✓ | ✗ (client-side pdfjs) | ✗ |
| Decision extraction | ✓ | ✓ | ✓ (server fn) | ✗ |
| X-Ray analysis | ✓ | ✓ | ✓ (server fn) | ✗ |
| Timeline | ✓ | ✓ | ✓ (HTTP handler) | ✗ |
| Grounds | ✓ | ✓ | ✗ (client state) | ✗ |
| Evidence | ✓ | ✓ | ✗ (client state) | ✗ |
| Arguments | ✓ | ✓ | ✗ (client state) | ✗ |
| Stress test | ✓ | ✓ | ✓ (server fn) | ✗ |
| Draft generation | ✓ | ✓ | ✗ (client-side) | ✗ |
| Readiness review | ✓ | ✓ | ✗ (client-side) | ✗ |
| Packet assembly | ✓ | ✓ | ✗ (client-side) | ✗ |
| Stripe checkout | ✓ | ✓ | ✓ (server fn) | ✗ |
| Supabase persistence | ✓ | Partial | ✓ (server fn) | ✓ (ownership/versioning) |
| Mailing | Partial | Placeholder | ✗ (not wired) | ✗ |
| Proof packet | ✓ | ✓ | ✗ (client-side) | ✗ |
| Content sanitization | ✓ | ✗ (not wired) | ✗ | ✗ |
| Rate limiting | ✓ | ✗ (server fn only) | ✓ | ✓ (unit test) |
| Audit trail | ✓ | ✗ (not wired) | ✓ | ✗ |

**Critical disconnections:**
1. Content sanitization exists but is NOT applied to uploaded documents before X-Ray analysis
2. Audit events are defined but NOT emitted during appeal lifecycle
3. Mailing is NOT wired — Stripe checkout creates a session but no MailMyPDF fulfillment is called
4. No server-side validation gate before mailing
5. No idempotency enforcement on mailing

---

## 6. Security Gaps

1. **Content sanitization not applied:** `sanitizeExtractedText` exists in `lib/platform/documents.ts` but `text-extraction.ts` only validates filename/size/MIME. The X-Ray server function does sanitize, but the client-side extraction path does not.
2. **No server-side mailing gate:** `createCheckoutSession` creates a Stripe session but does not validate case ownership, draft completeness, or mailing authorization server-side before payment.
3. **No idempotency on mailing:** `idempotency_key` exists in the MailMyPDF types but is not generated or enforced.
4. **Client-trusted workflow IDs:** Workflow ID comes from the route, not validated server-side.
5. **No replay protection:** No nonce or CSRF token on server functions.
6. **Stripe webhook route warning:** `api/stripe-webhook.ts` doesn't export a Route, causing build warnings.
7. **No physical-mail side-effect gate:** No explicit server-side check that all validation passed before mailing.

---

## 7. Persistence Gaps

1. **Appeals saved but not loaded:** `saveAppeal` exists but there's no `loadAppeal` server function. The dashboard only shows mailings, not saved appeals.
2. **No document storage:** Documents are extracted client-side, text is kept in component state, but raw documents are never stored (Supabase Storage integration exists in types but not wired).
3. **No appeal versioning UI:** Optimistic concurrency exists in the repository but the UI doesn't handle version conflicts.
4. **No audit trail UI:** Audit events are defined but never displayed.

---

## 8. UI/Product-Quality Gaps

### Current State
- Landing page is rich and well-structured (workflows, features, steps, testimonials, comparison table, FAQ)
- Workspace shell with sidebar navigation exists
- X-Ray, stress test, and timeline views exist as components
- Design system uses indigo/navy theme with custom CSS (473 lines in `styles.css`)

### Gaps vs Notice Respond
1. **No extraction review step:** Notice Respond has a dedicated extraction review phase showing classified facts with source excerpts. Appeal Mail jumps straight to X-Ray without showing what was extracted.
2. **No discrepancy/evidence checklist:** Notice Respond shows structured discrepancy analysis and evidence checklists with required/missing/ready status.
3. **No strategy display:** Notice Respond shows response strategy with position, issues, actions, risk flags. Appeal Mail has no strategy display.
4. **No research sources:** Notice Respond shows authoritative IRS sources with links. Appeal Mail has no source citations.
5. **No two-pass validation display:** Notice Respond shows validation findings (errors/warnings/blocks) with provenance. Appeal Mail has readiness review but no draft validation.
6. **No draft provenance:** Notice Respond shows supported/unsupported/blocking claims. Appeal Mail doesn't track provenance.
7. **Monolithic wizard:** The 1512-line `workflow-wizard.tsx` handles all 4 workflows and 18 steps. Notice Respond has per-workflow routes with shared shell components.
8. **No SEO structured data:** Notice Respond has FAQ schema, WebApplication schema, canonical links. Appeal Mail has basic meta tags only.
9. **No per-workflow landing pages:** Appeal Mail has a generic `/appeal-a-decision` page but no per-workflow SEO pages.
10. **Loading/error states:** Minimal. No skeleton loaders, no error boundaries, no empty states beyond basic.

---

## 9. Factory Readiness

### Current State
- No factory pattern exists in Appeal Mail
- No executable adapter
- No type mappings
- No parity tests
- The mailmypdf-platform has a `vertical-foundry` package but it's a build pipeline for generating new verticals, not a runtime factory for domain intelligence

### What Would Be Needed
1. **Executable adapter:** Map Appeal Mail's domain types (Decision, Ground, Evidence, XRayFinding) to a common factory interface
2. **Type mappings:** Map workflow-specific extraction to common types
3. **Factory registration:** Register appeal workflows in a factory registry
4. **Parity tests:** Verify factory output matches direct domain output

### Assessment
- **Factory readiness: LOW** — no factory infrastructure exists
- The 4 workflow definitions in `workflows.ts` are static configs, not factory-registered
- The domain models are already well-typed (Zod schemas) which is a good foundation

---

## 10. Workflow Roadmap

### Existing Workflows (all implemented, all use the same wizard)
1. `denied-claim` — Appeal a Denied Claim (insurance, benefits, workers' comp)
2. `government-decision` — Appeal a Government Decision (benefits, licensing, agency)
3. `court-ruling` — Appeal a Court Ruling (small claims, traffic, municipal)
4. `reconsideration` — Submit a Reconsideration Request

### Highest-Value Next Workflow (based on SEO data from docs/SEO_KEYWORD_MAP.md)
1. **Insurance Appeal** — 320 MSV for "appeal insurance letter sample", $CPC unknown, LOW competition
2. **Financial Aid Appeal** — 1,000 MSV for "financial aid appeal letter", HIGH commercial intent (education)
3. **EDD/Benefits Appeal** — 110 MSV for "EDD appeal letter example", government niche

### Recommended First Real Workflow
**Insurance Appeal** — because:
- Highest keyword volume after the generic "appeal letter" (320 MSV)
- The existing `denied-claim` workflow already has the closest domain match
- Insurance denial letters have structured format (denial reason, policy reference, appeal instructions)
- Can leverage existing X-Ray engine with minimal adaptation
- Clear user intent: "my claim was denied, I want to appeal"

---

## 11. Highest-Value Next Milestones

### Priority 1: Fix Build & Security
1. Fix `stripe-webhook.ts` route warning (rename or exclude)
2. Wire content sanitization into text extraction pipeline
3. Add server-side mailing gate with idempotency

### Priority 2: Gold-Standard Analysis
4. Add two-pass draft validation (factual + requirement)
5. Add draft provenance tracking
6. Add blocking status to findings
7. Wire audit events into appeal lifecycle

### Priority 3: UI/UX Polish
8. Add extraction review step (show extracted facts before X-Ray)
9. Add strategy display with position, issues, actions, risk flags
10. Add validation findings display with provenance
11. Add authoritative source citations
12. Split monolithic wizard into per-workflow routes
13. Add SEO structured data (FAQ schema, canonical links)
14. Add loading states, error boundaries, empty states

### Priority 4: Factory Integration
15. Create executable adapter mapping domain types to factory interface
16. Register workflows in factory registry
17. Add parity tests

### Priority 5: Persistence
18. Add `loadAppeal` server function
19. Wire document storage (Supabase Storage)
20. Add saved appeals to dashboard

### Priority 6: First Real Workflow
21. Implement Insurance Appeal workflow with full gold-standard pipeline
22. Add focused tests, negative tests, parity tests
23. Add SEO landing page

---

## Ecosystem Comparison Summary

| Aspect | Notice Respond | Appeal Mail | MailMyPDF |
|---|---|---|---|
| Design system | Government paper (cream/slate/emerald) | Indigo/navy custom | Warm postal (cream/navy/red) |
| Framework | TanStack Start + Vite 8 | TanStack Start + Vite 8 | TanStack Start + Vite 8 |
| Domain approach | Per-notice modules (CP2000, CP14, CP504, CP523) | Shared wizard for all types | Per-vertical routing |
| Factory pattern | Yes (executable packs, parity tests) | No | No |
| Two-pass validation | Yes (factual + requirement) | No | No |
| Draft provenance | Yes (supported/unsupported/blocking) | No | No |
| Security | Content sanitization wired | Exists but not wired | Content sanitization wired |
| Persistence | Not wired | Supabase with ownership | Full Supabase |
| Mailing | MailingFunnel component | Placeholder | Full Lob integration |
| Tests | 815 (domain + pipeline + parity) | 138 (platform primitives only) | Full suite |
| SEO | Per-workflow pages + schema | Generic landing only | Per-vertical pages |
