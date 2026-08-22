# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22

## Overview

20 appeal workflows across 7 categories. 1 original flagship plus Gold-upgraded workflow routes in progress; catalog marks only verified executable routes as implemented.

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

### Government Benefits
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| medicaid | Medicaid Appeal | Gold PR #11 | ✅ |
| snap | SNAP Appeal | Gold PR #12 | ✅ |
| benefits-denial | Benefits Denial Appeal | COMING_SOON | ❌ |
| snap-eligibility | SNAP Eligibility Appeal | COMING_SOON | ❌ |

### Disability & Social Security
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| ssi | SSI Appeal | COMING_SOON | ❌ |
| ssdi | SSDI Appeal | Gold PR #6 | ✅ |
| social-security-reconsideration | Social Security Reconsideration | Gold PR #6 | ✅ |
| social-security-overpayment | Social Security Overpayment Appeal | Gold PR #7 | ✅ |
| appeals-council | Appeals Council Appeal | Gold PR #8 | ✅ |

### Unemployment
| Slug | Title | Status | Executable |
|------|-------|--------|------------|
| unemployment | Unemployment Appeal | Gold PR #9 | ✅ |
| edd | EDD Appeal | Gold PR #10 | ✅ |

### Other categories

Insurance: insurance-claim implemented; remaining insurance workflows COMING_SOON.
Workers' Compensation: workers-comp and workers-comp-claim-denial COMING_SOON.
Veterans: va-claim COMING_SOON.
Administrative: agency-decision, administrative-decision, licensing upgraded in PRs #3–#5.

## Executable Gold routes

- `/workflows/ssdi-appeal`
- `/workflows/social-security-reconsideration`
- `/workflows/social-security-overpayment`
- `/workflows/appeals-council`
- `/workflows/unemployment-appeal`
- `/workflows/edd-appeal`
- `/workflows/medicaid-appeal`
- `/workflows/snap-appeal`

## Catalog Entry Schema

Each entry should include stable slug/title/category, product copy, search intent, authority maturity, SEO title/description, related keywords, route, status, engine, executable flag, CTA, and pricing profile.
