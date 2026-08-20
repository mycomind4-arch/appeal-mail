# DEEP_AUDIT.md — Appeal Mail

**Date:** 2026-08-19 (updated 2026-08-20)
**Auditor:** Implementation Agent (no subagents)
**Repository:** https://github.com/mycomind4-arch/appeal-mail
**Branch:** main
**Commit:** 3b2ba9fd

---

## 1. Current Architecture

### Stack
- **Framework:** TanStack Start (React 19 + TanStack Router + Vite 8)
- **Styling:** Tailwind CSS v4 with custom "Government paper" design tokens
- **State:** React state (no global store) — workflow wizard holds all state in component
- **Persistence:** Supabase (Postgres + Auth + Storage)
- **Payments:** Stripe (checkout sessions, webhook)
- **Mailing:** MailMyPDF fulfillment API (via platform adapter)
- **Document Processing:** pdfjs-dist (client-side PDF text extraction)
- **Testing:** Node.js built-in test runner (`node --test`)
- **Deployment:** Cloudflare Workers (via Nitro)

### Project Structure (current)
```
src/
├── components/
│   ├── appeal-workflow-directory.tsx  # NEW — search/filter catalog component
│   ├── appeal-workflow-page.tsx        # NEW — placeholder page template
│   ├── site-header.tsx                  # UPDATED — consistent nav
│   ├── site-footer.tsx                  # UPDATED — full catalog footer
│   ├── stress-test/stress-test-view.tsx
│   ├── timeline/timeline-view.tsx
│   ├── workflow/workflow-wizard.tsx     # 1512-line monolith — all workflow logic
│   ├── workspace/app-shell.tsx
│   └── xray/xray-view.tsx
├── domain/
│   ├── appeal-catalog.ts                # NEW — canonical workflow catalog (19 entries)
│   ├── appeal.ts, decision.ts, ground.ts, evidence.ts, argument.ts
│   ├── review.ts, packet.ts, proof.ts, xray.ts, stress-test.ts
│   ├── timeline.ts, workflows.ts, mailing.ts
├── platform/
│   ├── appeal-repository.ts, checkout-fn.ts, document-extraction.ts
│   ├── text-extraction.ts, xray-fn.ts, stress-test-fn.ts
│   ├── timeline-fn.ts, extract-fn.ts, mailmypdf.ts, mailmypdf-provider.ts
│   ├── intelligence-adapter.ts, supabase.ts, index.ts
│   └── text-extraction.ts
├── lib/platform/
│   ├── core.ts, documents.ts, intelligence.ts
├── routes/
│   ├── index.tsx                        # UPDATED — polished homepage
│   ├── workflows.tsx                    # UPDATED — real directory with search
│   ├── appeal/$slug.tsx                 # NEW — dynamic route for catalog pages
│   ├── workflows/denied-claim.tsx       # EXECUTABLE — Insurance Appeal
│   ├── workflows/government-decision.tsx
│   ├── workflows/court-ruling.tsx
│   ├── workflows/reconsideration.tsx
│   ├── appeal-a-decision.tsx
│   ├── dashboard.tsx, auth.tsx, pricing.tsx, about.tsx
│   ├── contact.tsx, faq.tsx, privacy.tsx, terms.tsx
│   ├── resources/index.tsx, resources/$slug.tsx
│   └── api/stripe-webhook.ts
└── tests/
    ├── appeal-catalog.test.ts           # NEW — 27 catalog tests
    ├── ownership-versioning.test.ts
    ├── platform-core.test.ts
    ├── platform-documents.test.ts
    └── platform-intelligence.test.ts
```

## 2. Production Execution Path

The Insurance Appeal workflow (`/workflows/denied-claim`) is the only executable workflow:

```
User → /workflows/denied-claim → WorkflowWizard (1512 lines)
  → Upload decision document (pdfjs-dist)
  → Appeal X-Ray™ analysis (deterministic pattern matching)
  → Review extracted decision facts
  → Timeline reconstruction
  → Build appeal grounds
  → Manage evidence + link to grounds
  → Construct arguments
  → Stress test (adversarial review)
  → AI-assisted draft
  → Final stress test (vulnerability check)
  → Readiness review
  → Assemble packet
  → Recipient selection
  → Mailing method selection
  → Stripe checkout
  → Proof record (SHA-256)
```

This path is intact and unchanged by this milestone.

## 3. Workflow Catalog

### Implemented (1)
- `denied-claim` — Insurance/Claims Appeal (the flagship)

### Coming Soon (18)
Across 7 categories:
- **Insurance (7):** Insurance Claim, Health Insurance, Prior Authorization, Out-of-Network, Timely Filing, Medicare, Dental Insurance
- **Disability & Social Security (5):** SSI, SSDI, Social Security Reconsideration, Social Security Overpayment, Appeals Council
- **Unemployment (2):** Unemployment Appeal, EDD Appeal
- **Government Benefits (2):** Medicaid, SNAP
- **Workers' Compensation (1):** Workers Comp Appeal
- **Veterans (1):** VA Claim Appeal
- **Administrative (2):** Agency Decision, Licensing

### Status Integrity
- COMING_SOON entries have `executable: false`
- IMPLEMENTED entries have `executable: true`
- Placeholder routes (`/appeal/$slug`) cannot enter the WorkflowWizard runtime
- Only `/workflows/denied-claim` (and the 3 other shared-wizard routes) invoke the executable

## 4. Design System

The design system ("Government paper") is shared with Notice Respond:
- Cream paper background (`--paper: oklch(0.97 0.012 120)`)
- Deep slate ink (`--ink: oklch(0.25 0.04 240)`)
- Emerald stamp accent (`--stamp: oklch(0.55 0.15 160)`)
- Instrument Serif headings, Inter body, JetBrains Mono accents
- Custom utilities: `postmark`, `envelope-card`, `wax-seal`, `hairline`

## 5. Test Results

- **Total tests:** 165
- **Passing:** 165
- **Failing:** 0
- **New tests:** 27 (appeal-catalog.test.ts)

## 6. Build

Build passes. Cloudflare Workers output generated successfully.

## 7. What Looks Production Quality
- Homepage with hero, flow bar, stats, catalog preview, trust section, features, steps, FAQ
- Workflow directory with search, filter, and grouped categories
- Placeholder pages with rich content sections
- Design system consistency with Notice Respond
- Footer with full catalog
- Header with consistent navigation

## 8. What Still Needs Work
- Category parent pages (`/appeal/insurance`, `/appeal/disability`, etc.) not yet created
- Some old routes (`/workflows/government-decision`, `/workflows/court-ruling`, `/workflows/reconsideration`) still use the shared wizard but are not in the new catalog
- Resources pages still use old non-design-system colors (teal, slate, amber)
- No deployment verification yet
