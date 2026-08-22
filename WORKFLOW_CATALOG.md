# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Overview

20 appeal workflows across 7 categories. 17 executable or Gold-upgraded, 3 remaining in the current catalog.

## Categories

| Category | Slug | Workflows |
|----------|-------|-----------|
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
| social-security-reconsideration | Social Security Reconsideration | GOLD_UPGRADED | ✅ |
| social-security-overpayment | Social Security Overpayment Appeal | GOLD_UPGRADED | ✅ |
| appeals-council | Appeals Council Appeal | GOLD_UPGRADED | ✅ |

### Unemployment (2)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| unemployment-appeal | Unemployment Appeal | GOLD_UPGRADED | ✅ |
| edd-appeal | EDD Appeal | GOLD_UPGRADED | ✅ |

### Government Benefits (4)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| medicaid-appeal | Medicaid Appeal | GOLD_UPGRADED | ✅ |
| snap-appeal | SNAP Appeal | GOLD_UPGRADED | ✅ |
| benefits-denial-appeal | Benefits Denial Appeal | GOLD_UPGRADED | ✅ |
| snap-eligibility-appeal | SNAP Eligibility Appeal | GOLD_UPGRADED | ✅ |

### Workers' Compensation (2)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| workers-comp-appeal | Workers Comp Appeal | GOLD_UPGRADED | ✅ |
| workers-comp-claim-denial | Workers Comp Claim Denial | COMING_SOON | ❌ |

### Veterans (1)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| va-claim | VA Claim Appeal | COMING_SOON | ❌ |

### Administrative (3)
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| agency-decision-appeal | Agency Decision Appeal | GOLD_UPGRADED | ✅ |
| administrative-decision-appeal | Administrative Decision Appeal | GOLD_UPGRADED | ✅ |
| licensing-appeal | Licensing Appeal | GOLD_UPGRADED | ✅ |

## Routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Executable workflows use `/workflows/<workflow-slug>`

## Catalog Entry Schema

Each entry has: slug, title, category, shortDescription, longDescription, intendedUser, problemSolved, whatWeAnalyze[], whatYouNeed[], whatWeIdentify[], whatAppealAddresses[], seoTitle, seoDescription, primaryKeyword, relatedKeywords[], route, status, engine, executable, cta
