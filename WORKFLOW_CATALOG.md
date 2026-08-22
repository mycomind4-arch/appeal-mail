# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22
**Commit:** Agency Decision Gold

---

## Overview

20 appeal workflows across 7 categories. 3 executable Gold-standard workflows, with the remaining catalog entries staged for subsequent upgrades.

## Categories

| Category | Slug | Workflows |
|----------|------|-----------|
| Insurance | insurance | 9 |
| Disability & Social Security | disability | 5 |
| Unemployment | unemployment | 2 |
| Government Benefits | benefits | 4 |
| Workers' Compensation | workers-comp | 2 |
| Veterans | veterans | 1 |
| Administrative | administrative | 3 |

## Workflows

### Insurance (9)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| insurance-claim | Insurance Claim Appeal | IMPLEMENTED | ✅ |
| health-insurance | Health Insurance Appeal | COMING_SOON | ❌ |
| medical-claim | Medical Claim Appeal | COMING_SOON | ❌ |
| prior-authorization | Prior Authorization Appeal | COMING_SOON | ❌ |
| out-of-network | Out-of-Network Appeal | COMING_SOON | ❌ |
| no-authorization | No Authorization Appeal | COMING_SOON | ❌ |
| timely-filing | Timely Filing Appeal | COMING_SOON | ❌ |
| medicare | Medicare Appeal | COMING_SOON | ❌ |
| dental-insurance | Dental Insurance Appeal | COMING_SOON | ❌ |

### Disability & Social Security (5)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| ssi | SSI Appeal | COMING_SOON | ❌ |
| ssdi | SSDI Appeal | COMING_SOON | ❌ |
| social-security-reconsideration | Social Security Reconsideration | COMING_SOON | ❌ |
| social-security-overpayment | Social Security Overpayment Appeal | COMING_SOON | ❌ |
| appeals-council | Appeals Council Appeal | COMING_SOON | ❌ |

### Unemployment (2)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| unemployment | Unemployment Appeal | COMING_SOON | ❌ |
| edd | EDD Appeal | COMING_SOON | ❌ |

### Government Benefits (4)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| medicaid | Medicaid Appeal | COMING_SOON | ❌ |
| snap | SNAP Appeal | COMING_SOON | ❌ |
| benefits-denial | Benefits Denial Appeal | COMING_SOON | ❌ |
| snap-eligibility | SNAP Eligibility Appeal | COMING_SOON | ❌ |

### Workers' Compensation (2)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| workers-comp | Workers Comp Appeal | COMING_SOON | ❌ |
| workers-comp-claim-denial | Workers Comp Claim Denial | COMING_SOON | ❌ |

### Veterans (1)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| va-claim | VA Claim Appeal | COMING_SOON | ❌ |

### Administrative (3)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| agency-decision | Agency Decision Appeal | GOLD | ✅ |
| administrative-decision | Administrative Decision Appeal | GOLD | ✅ |
| licensing | Licensing Appeal | COMING_SOON | ❌ |

## Gold workflow #3

### Agency Decision Appeal

- User-facing route: `/workflows/agency-decision`
- API analyze: `/api/workflows/agency-decision/analyze`
- API draft: `/api/workflows/agency-decision/draft`
- API approval/readiness: `/api/workflows/agency-decision/approve`
- API checkout: `/api/workflows/agency-decision/checkout`
- Post-payment fulfillment: `/api/stripe-webhook`
- Primary SEO intent: `agency decision appeal`
- Related intent: `appeal an agency decision`, `administrative agency appeal`, `government agency decision appeal`, `administrative decision review`, `challenge agency decision`

The landing page explicitly explains authority verification, deadline verification, appeal-path verification, evidence intelligence, contradiction analysis, independent validation, human approval, and provider-backed proof. Procedural claims remain source-dependent and unresolved claims are surfaced rather than invented.

## Routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Gold executable workflows: `/workflows/denied-claim`, `/workflows/government-decision`, `/workflows/agency-decision`

## Catalog Entry Schema

Each entry has: slug, title, category, shortDescription, longDescription, intendedUser, problemSolved, whatWeAnalyze[], whatYouNeed[], whatWeIdentify[], whatAppealAddresses[], seoTitle, seoDescription, primaryKeyword, relatedKeywords[], route, status, engine, executable, cta
