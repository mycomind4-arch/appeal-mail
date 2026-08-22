# Agency Decision Appeal — Supreme Authority Gold Standard

## Workflow identity

- Workflow ID: `agency-decision-appeal`
- User-facing title: **Appeal an Agency Decision**
- Purpose: analyze an agency-issued administrative decision and prepare a jurisdiction-verified appeal response for human approval and certified mailing through MailMyPDF.

## Authority-first promise

The workflow never invents an appeal deadline, filing destination, required form, exhaustion requirement, review level, stay rule, or service method. Every procedural conclusion must be traceable to an identified authoritative source or explicitly marked **unverified**.

## Landing-page authority content

The landing page must communicate:

1. **Decision analysis** — what the agency decided, when, why, and which authority it cited.
2. **Authority verification** — official agency, court, statute, regulation, rule, or authoritative administrative source is shown beside each procedural conclusion.
3. **Deadline verification** — extracted dates are distinguished from verified procedural deadlines; an unsupported date never becomes a filing deadline.
4. **Appeal-path verification** — the system identifies the apparent review path and clearly flags missing jurisdiction/agency information.
5. **Evidence readiness** — users see supporting evidence, missing evidence, contradictions, and unresolved factual disputes before drafting.
6. **Independent validation** — the draft is challenged against the decision, source authority, evidence record, and uncertainty register.
7. **Human approval** — no final mailing occurs until the user approves the final response.
8. **Proof** — the final response PDF, mailing record, provider status, and tracking/proof record are retained through MailMyPDF.

## Executable pipeline

`upload → classify → extract → authority-resolve → deadline-check → appeal-path-check → evidence-gap analysis → contradiction detection → timeline/x-ray → adversarial stress test → response strategy → draft → independent validation → readiness gate → human approval → deterministic PDF → Stripe checkout → MailMyPDF document upload → communication → provider submission → provider-backed proof`

## Authority model

Each procedural finding carries:

- `claim`
- `sourceType`
- `sourceUrl`
- `sourceTitle`
- `jurisdiction`
- `effectiveDate`
- `retrievedAt`
- `confidence`
- `verificationState`
- `notes`

Allowed `verificationState` values:

- `verified`
- `partially_verified`
- `unverified`
- `conflicting`

## Safety boundaries

- Never infer a deadline from a generic administrative-appeal convention.
- Never treat the decision date as the appeal deadline without authority support.
- Never assume exhaustion is required or waived.
- Never assume the first reviewer, tribunal, hearing format, or filing channel.
- Never invent an agency contact address.
- Never draft unsupported factual assertions as established facts.

## Readiness gate

The workflow is not ready for payment until:

- the decision is identified;
- the agency/jurisdiction is sufficiently identified or the gap is explicitly surfaced;
- procedural claims have authoritative support or are marked unresolved;
- material evidence gaps are shown;
- contradictions have been surfaced;
- the response strategy is internally consistent;
- the draft passes independent validation;
- the user has explicitly approved the final response.

## SEO / landing-page intent

Primary intent: `agency decision appeal`

Secondary intent families:

- appeal an agency decision
- administrative agency appeal
- government agency decision appeal
- administrative decision review
- challenge agency decision
- agency decision appeal process

SEO copy must remain informative and authority-led rather than claiming a universal government process.
