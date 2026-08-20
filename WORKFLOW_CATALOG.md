# WORKFLOW_CATALOG.md — Appeal Mail

**Date:** 2026-08-20
**Source:** src/domain/appeal-catalog.ts

---

## Summary

- **Total workflows:** 19
- **Implemented:** 1 (Insurance Appeal via `/workflows/denied-claim`)
- **Coming soon:** 18
- **Categories:** 7

## Categories and Workflows

### Insurance (7 workflows — all COMING_SOON)

| Slug | Title | Route | Status | Primary Keyword |
|------|-------|-------|--------|-----------------|
| insurance-claim | Insurance Claim Appeal | /appeal/insurance-claim | COMING_SOON | denial of insurance claim |
| health-insurance | Health Insurance Appeal | /appeal/health-insurance | COMING_SOON | health insurance appeal |
| prior-authorization | Prior Authorization Appeal | /appeal/prior-authorization | COMING_SOON | prior authorization appeal |
| out-of-network | Out-of-Network Appeal | /appeal/out-of-network | COMING_SOON | out-of-network appeal |
| timely-filing | Timely Filing Appeal | /appeal/timely-filing | COMING_SOON | timely filing appeal |
| medicare | Medicare Appeal | /appeal/medicare | COMING_SOON | Medicare appeal |
| dental-insurance | Dental Insurance Appeal | /appeal/dental-insurance | COMING_SOON | dental insurance appeal |

### Disability & Social Security (5 workflows — all COMING_SOON)

| Slug | Title | Route | Status | Primary Keyword |
|------|-------|-------|--------|-----------------|
| ssi | SSI Appeal | /appeal/ssi | COMING_SOON | SSI appeal |
| ssdi | SSDI Appeal | /appeal/ssdi | COMING_SOON | denied SSDI |
| social-security-reconsideration | Social Security Reconsideration | /appeal/social-security-reconsideration | COMING_SOON | Social Security reconsideration |
| social-security-overpayment | Social Security Overpayment Appeal | /appeal/social-security-overpayment | COMING_SOON | Social Security overpayment appeal |
| appeals-council | Appeals Council Appeal | /appeal/appeals-council | COMING_SOON | SSDI Appeals Council |

### Unemployment (2 workflows — all COMING_SOON)

| Slug | Title | Route | Status | Primary Keyword |
|------|-------|-------|--------|-----------------|
| unemployment | Unemployment Appeal | /appeal/unemployment | COMING_SOON | unemployment appeal |
| edd | EDD Appeal | /appeal/edd | COMING_SOON | EDD appeal |

### Government Benefits (2 workflows — all COMING_SOON)

| Slug | Title | Route | Status | Primary Keyword |
|------|-------|-------|--------|-----------------|
| medicaid | Medicaid Appeal | /appeal/medicaid | COMING_SOON | appeal for Medicaid |
| snap | SNAP / Food Stamp Appeal | /appeal/snap | COMING_SOON | SNAP appeal |

### Workers' Compensation (1 workflow — COMING_SOON)

| Slug | Title | Route | Status | Primary Keyword |
|------|-------|-------|--------|-----------------|
| workers-comp | Workers' Compensation Appeal | /appeal/workers-comp | COMING_SOON | workers compensation appeal |

### Veterans (1 workflow — COMING_SOON)

| Slug | Title | Route | Status | Primary Keyword |
|------|-------|-------|--------|-----------------|
| va-claim | VA Claim Appeal | /appeal/va-claim | COMING_SOON | appeal VA claim |

### Administrative (2 workflows — all COMING_SOON)

| Slug | Title | Route | Status | Primary Keyword |
|------|-------|-------|--------|-----------------|
| agency-decision | Agency Decision Appeal | /appeal/agency-decision | COMING_SOON | agency decision appeal |
| licensing | Licensing Appeal | /appeal/licensing | COMING_SOON | licensing appeal |

## Implementation Engine Architecture (planned, NOT implemented)

```
Insurance Appeal Engine
    ├── Insurance Claim Appeal
    ├── Health Insurance Appeal
    ├── Prior Authorization Appeal
    ├── Out-of-Network Appeal
    ├── Timely Filing Appeal
    ├── Medicare Appeal
    └── Dental Insurance Appeal

Disability Appeal Engine
    ├── SSI Appeal
    ├── SSDI Appeal
    ├── Social Security Reconsideration
    ├── Social Security Overpayment Appeal
    └── Appeals Council Appeal

Unemployment Appeal Engine
    ├── Unemployment Appeal
    └── EDD Appeal

Benefits Appeal Engine
    ├── Medicaid Appeal
    └── SNAP Appeal

Workers Compensation Engine
    └── Workers Comp Appeal

Veterans Appeal Engine
    └── VA Claim Appeal

Administrative Appeal Engine
    ├── Agency Decision Appeal
    └── Licensing Appeal
```

## Executable Runtime

Only `/workflows/denied-claim` (Insurance Appeal) enters the WorkflowWizard runtime.

The `/appeal/$slug` dynamic route renders placeholder pages and NEVER invokes:
- WorkflowWizard
- X-Ray analysis
- Stress test
- Draft generation
- Mailing flow
- Checkout

Placeholder workflows cannot accidentally execute.
