# WORKFLOW_CATALOG.md — Appeal Mail

**Last updated:** 2026-08-22
**Status:** Gold rollout catalog

## Overview

20 appeal workflows across 7 categories. Gold rollout is proceeding workflow-by-workflow with executable pipelines, authority-first landing pages, pricing, fulfillment, proof, and certification tests.

## Workflows

### Insurance
| Slug | Title | Status | Executable |
|---|---|---|---|
| insurance-claim | Insurance Claim Appeal | IMPLEMENTED | ✅ |
| health-insurance | Health Insurance Appeal | COMING_SOON | ❌ |
| medical-claim | Medical Claim Appeal | COMING_SOON | ❌ |
| prior-authorization | Prior Authorization Appeal | COMING_SOON | ❌ |
| out-of-network | Out-of-Network Appeal | COMING_SOON | ❌ |
| no-authorization | No Authorization Appeal | COMING_SOON | ❌ |
| timely-filing | Timely Filing Appeal | COMING_SOON | ❌ |
| medicare | Medicare Appeal | COMING_SOON | ❌ |
| dental-insurance | Dental Insurance Appeal | COMING_SOON | ❌ |

### Disability & Social Security
| Slug | Title | Status | Executable |
|---|---|---|---|
| ssi | SSI Appeal | COMING_SOON | ❌ |
| ssdi | SSDI Appeal | GOLD_PR | ✅ |
| social-security-reconsideration | Social Security Reconsideration | GOLD_PR | ✅ |
| social-security-overpayment | Social Security Overpayment Appeal | GOLD_PR | ✅ |
| appeals-council | Appeals Council Appeal | GOLD_PR | ✅ |

### Unemployment
| Slug | Title | Status | Executable |
|---|---|---|---|
| unemployment | Unemployment Appeal | GOLD_PR | ✅ |
| edd | EDD Appeal | GOLD_PR | ✅ |

### Government Benefits
| Slug | Title | Status | Executable |
|---|---|---|---|
| medicaid | Medicaid Appeal | GOLD_PR | ✅ |
| snap | SNAP Appeal | GOLD_PR | ✅ |
| benefits-denial | Benefits Denial Appeal | GOLD_PR | ✅ |
| snap-eligibility | SNAP Eligibility Appeal | GOLD_PR | ✅ |

### Workers' Compensation
| Slug | Title | Status | Executable |
|---|---|---|---|
| workers-comp | Workers Comp Appeal | COMING_SOON | ❌ |
| workers-comp-claim-denial | Workers Comp Claim Denial | COMING_SOON | ❌ |

### Veterans
| Slug | Title | Status | Executable |
|---|---|---|---|
| va-claim | VA Claim Appeal | COMING_SOON | ❌ |

### Administrative
| Slug | Title | Status | Executable |
|---|---|---|---|
| agency-decision | Agency Decision Appeal | GOLD_PR | ✅ |
| administrative-decision | Administrative Decision Appeal | GOLD_PR | ✅ |
| licensing | Licensing Appeal | GOLD_PR | ✅ |

## Routes

- Category pages: `/appeal/insurance`, `/appeal/disability`, `/appeal/unemployment`, `/appeal/benefits`, `/appeal/workers-comp`, `/appeal/veterans`, `/appeal/administrative`
- Workflow pages: `/appeal/$slug`
- Gold executable workflows use `/workflows/<workflow-slug>`.

## Gold catalog requirements

Every Gold workflow must include authority-first SEO/landing content, source-grounded Gemini analysis, separate drafting and independent validation, human approval/readiness, workflow-specific transparent pricing, deterministic final PDF, Stripe checkout, MailMyPDF fulfillment, provider tracking/proof, and certification tests.
