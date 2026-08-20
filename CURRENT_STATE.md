# CURRENT_STATE.md — Appeal Mail

**Last updated:** 2026-08-20
**Commit:** 3b2ba9fd
**Branch:** main

---

## Product Status

### What is complete

- **Homepage** — Polished hero with "Start an Appeal" + "Explore Appeal Types" CTAs, visual flow bar (Upload → Understand → Analyze → Evidence → Build → Review → Send → Prove), stats, workflow catalog preview by category, trust/safety section, features grid, step-by-step guide, FAQ, and final CTA
- **Workflow directory** (`/workflows`) — Real product directory with:
  - Search bar (search by title, keyword, category)
  - Category filter dropdown
  - Status filter (All / Available Now / Coming Soon)
  - Grouped display by 7 categories with descriptions
  - Stats bar showing total/available/coming soon counts
  - Empty state with "Clear filters" button
- **Workflow placeholder pages** (`/appeal/$slug`) — Each of the 18 coming-soon workflows has a polished page with:
  - Hero with category badge and status indicator
  - Long description
  - What We Analyze / What You'll Need / What We Identify / What Your Appeal Can Address sections
  - Intended user and problem solved
  - Honest "Coming soon" CTA (never "Start Appeal" for non-executable workflows)
  - SEO metadata (title, description, canonical, structured data)
- **Workflow catalog** (`src/domain/appeal-catalog.ts`) — 19 entries across 7 categories with:
  - Stable slugs, routes, SEO titles/descriptions
  - Truthful IMPLEMENTED / COMING_SOON status
  - `executable` boolean (true only for IMPLEMENTED)
  - `validateCatalog()` function for test-time integrity checks
- **Site header** — Consistent with Notice Respond pattern (sticky, blur, mobile menu)
- **Site footer** — Full catalog categories with counts, MailMyPDF branding
- **Tests** — 165 passing (138 existing + 27 new catalog tests)
- **Build** — Passes, Cloudflare Workers output generated

### Insurance Appeal (flagship)

The Insurance Appeal workflow at `/workflows/denied-claim` remains fully executable:
- Route: `/workflows/denied-claim`
- Component: `WorkflowWizard` (1512 lines)
- Full pipeline: Upload → X-Ray → Decision → Timeline → Grounds → Evidence → Arguments → Stress Test → Draft → Final Test → Readiness → Packet → Recipient → Mailing → Checkout → Proof
- Not modified in this milestone

### What is NOT implemented (by design)

- SSI, SSDI, unemployment, Medicaid, SNAP, workers comp, VA, and administrative appeal intelligence engines
- Category parent pages (`/appeal/insurance`, `/appeal/disability`, etc.)
- Workflow-specific extraction logic for non-insurance types
- Per-workflow domain intelligence
- Factory registration for new workflows

### Known gaps

1. Old routes (`/workflows/government-decision`, `/workflows/court-ruling`, `/workflows/reconsideration`) still use the shared wizard — these are legacy and could be deprecated or redirected
2. Resources pages (`/resources/$slug`) still use old non-design-system colors
3. The `appeal-a-decision.tsx` route uses inline styles and could be modernized
4. No category parent pages yet

## Test Results

```
# tests 165
# pass 165
# fail 0
```

## Build

```
✓ built in 586ms
[nitro] ✔ You can preview this build using npx vite preview
[nitro] ✔ You can deploy this build using npx nitro deploy --prebuilt
```

## Git

- Committed: 3b2ba9fd
- Pushed: yes (to origin/main)
