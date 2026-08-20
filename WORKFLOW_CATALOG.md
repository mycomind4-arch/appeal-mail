# WORKFLOW_CATALOG.md — Appeal Mail

**Date:** 2026-08-19
**Source:** docs/SEO_KEYWORD_MAP.md, docs/MASTER_WORKFLOW_DIRECTORY.md

---

## Implemented Workflows

| ID | Display Name | Domain | Status | Implementation | SEO Target | Keyword | MSV | CPC | Competition | Commercial Intent | User Intent | Implementation Difficulty | Reuse Score | Factory Ready |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `denied-claim` | Appeal a Denied Claim | Insurance/Benefits | **active** | Shared wizard | `/workflows/denied-claim` | appeal denied claim | — | — | — | HIGH | "My claim was denied, I want to appeal" | LOW (exists) | 1.0 (canonical) | ✗ |
| `government-decision` | Appeal a Government Decision | Government | **active** | Shared wizard | `/workflows/government-decision` | appeal government decision | — | — | — | HIGH | "I disagree with a government agency decision" | LOW (exists) | 1.0 (canonical) | ✗ |
| `court-ruling` | Appeal a Court Ruling | Legal | **active** | Shared wizard | `/workflows/court-ruling` | appeal court ruling | — | — | — | HIGH | "I want to appeal a court decision" | LOW (exists) | 1.0 (canonical) | ✗ |
| `reconsideration` | Submit a Reconsideration | Government/Insurance | **active** | Shared wizard | `/workflows/reconsideration` | letter for reconsideration | 170 | — | — | MEDIUM | "I want to request reconsideration before formal appeal" | LOW (exists) | 1.0 (canonical) | ✗ |

## Planned Workflows

| ID | Display Name | Domain | Status | Implementation | SEO Target | Keyword | MSV | CPC | Competition | Commercial Intent | User Intent | Implementation Difficulty | Reuse Score | Factory Ready | Authoritative Sources Required |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `insurance-appeal` | Insurance Appeal Letter | Insurance | **planned** | `implemented: false` | `/workflows/insurance-appeal` | appeal insurance letter sample | 320 | — | LOW | HIGH | "My insurance claim was denied, I need an appeal letter" | MEDIUM | 0.85 (denied-claim base) | ✗ | Insurance policy terms, state insurance regs, ACA appeals process |
| `financial-aid-appeal` | Financial Aid Appeal Letter | Education | **planned** | `implemented: false` | `/workflows/financial-aid-appeal` | financial aid appeal letter | 1,000 | — | MEDIUM | HIGH (education) | "My financial aid was reduced, I want to appeal" | MEDIUM | 0.70 (generic appeal base) | ✗ | FAFSA SAI formula, school SAP policy, DOE guidance |
| `sap-appeal` | SAP Appeal Letter | Education | **planned** | `implemented: false` | `/workflows/sap-appeal` | SAP appeal letter | 210 | — | LOW | HIGH (education) | "I failed SAP and need to appeal to keep financial aid" | MEDIUM | 0.65 | ✗ | Federal SAP requirements, school policy docs |
| `edd-appeal` | EDD Appeal Letter | Government/Benefits | **planned** | `implemented: false` | `/workflows/edd-appeal` | EDD appeal letter example | 110 | — | LOW | HIGH | "EDD denied my benefits, I need to appeal" | MEDIUM | 0.75 (government-decision base) | ✗ | CA EDD appeal process, UI code, CUIAB decisions |
| `fema-appeal` | FEMA Appeal Letter | Government/Benefits | **planned** | `implemented: false` | `/workflows/fema-appeal` | FEMA appeal letter example | 110 | — | LOW | MEDIUM | "FEMA denied my disaster assistance, I want to appeal" | MEDIUM | 0.70 | ✗ | FEMA appeals process, Stafford Act, 60-day deadline |
| `medicare-appeal` | Medicare Appeal Letter | Healthcare/Government | **planned** | `implemented: false` | `/workflows/medicare-appeal` | Medicare appeal letter examples | 70 | — | LOW | HIGH (healthcare) | "Medicare denied my coverage, I want to appeal" | HIGH (5 levels) | 0.60 | ✗ | Medicare appeals process (42 CFR 405), CMS guidance, 5-level system |
| `va-appeal` | VA Appeal Letter | Government/Benefits | **planned** | `implemented: false` | `/workflows/va-appeal` | VA caregiver appeal letter sample | 70 | — | LOW | HIGH | "VA denied my claim/caregiver benefits, I want to appeal" | HIGH (BVA process) | 0.60 | ✗ | VA appeals modernization (AMA), BVA decisions, Form 10182 |

## Workflow Priority Matrix

### Tier 1 — Implement Next (highest MSV × lowest difficulty)
1. **Insurance Appeal** — 320 MSV, LOW competition, HIGH reuse (0.85 from denied-claim), MEDIUM difficulty
2. **Financial Aid Appeal** — 1,000 MSV, MEDIUM competition, HIGH commercial intent, MEDIUM difficulty

### Tier 2 — Strong Candidates
3. **EDD Appeal** — 110 MSV, LOW competition, HIGH intent, MEDIUM difficulty
4. **SAP Appeal** — 210 MSV, LOW competition, niche education sub-market

### Tier 3 — Future Expansion
5. **FEMA Appeal** — 110 MSV, LOW competition, disaster niche
6. **Medicare Appeal** — 70 MSV, HIGH complexity (5 levels)
7. **VA Appeal** — 70 MSV, HIGH complexity (AMA process)

## Canonical Workflow IDs

```
appeal-mail
├── denied-claim         (ACTIVE — shared wizard)
├── government-decision  (ACTIVE — shared wizard)
├── court-ruling         (ACTIVE — shared wizard)
├── reconsideration      (ACTIVE — shared wizard)
├── insurance-appeal     (PLANNED — highest-value next)
├── financial-aid-appeal (PLANNED — highest MSV)
├── sap-appeal           (PLANNED — education niche)
├── edd-appeal           (PLANNED — benefits niche)
├── fema-appeal          (PLANNED — disaster niche)
├── medicare-appeal      (PLANNED — healthcare, complex)
└── va-appeal            (PLANNED — veterans, complex)
```

## Current Implementation State

All 4 existing workflows share a single `WorkflowWizard` component (1512 lines) with the same 18-step pipeline:
- Upload → X-Ray → Decision Review → Timeline → Grounds → Evidence → Arguments → Stress Test → Draft → Final Stress Test → Readiness → Packet → Recipient → Mailing → Checkout → Proof → Done

**No workflow has:**
- Per-workflow extraction logic
- Per-workflow domain intelligence
- Per-workflow validation
- Per-workflow SEO pages
- Factory registration

**All workflows share:**
- Same domain models (Decision, Ground, Evidence, XRay)
- Same extraction engine (pattern matching)
- Same X-Ray analysis
- Same stress test
- Same draft generation
- Same mailing pipeline
