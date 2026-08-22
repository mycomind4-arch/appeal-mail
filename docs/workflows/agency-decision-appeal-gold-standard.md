# Agency Decision Appeal — Supreme Authority Gold Standard

## Workflow identity

- Workflow ID: `agency-decision-appeal`
- User-facing title: **Appeal an Agency Decision**
- Primary intent: `agency decision appeal`

## Authority-first promise

The workflow never invents an appeal deadline, filing destination, required form, exhaustion requirement, review level, stay rule, or service method. Every procedural conclusion must be traceable to an identified authoritative source or explicitly marked unresolved.

## Landing-page authority content

The public experience explains that it can:

1. analyze the agency decision and separate agency findings, cited authority, disputed facts, and unknowns;
2. verify the apparent appeal path against official agency, court, statute, regulation, or rule sources;
3. distinguish dates extracted from a notice from a procedurally verified deadline;
4. identify evidence gaps and contradictions before drafting;
5. adversarially validate the response against the decision, authority record, and evidence;
6. require human approval before any final mailing;
7. retain the final response PDF, mailing record, provider status, and proof through MailMyPDF.

## Executable pipeline

`upload → classify → extract → authority-resolve → deadline-check → appeal-path-check → evidence-gap analysis → contradiction detection → timeline/x-ray → adversarial stress test → response strategy → draft → independent validation → readiness gate → human approval → deterministic PDF → Stripe checkout → MailMyPDF document upload → communication → provider submission → provider-backed proof`

## Authority record

Each procedural finding carries `claim`, `sourceType`, `sourceUrl`, `sourceTitle`, `jurisdiction`, `effectiveDate`, `retrievedAt`, `confidence`, `verificationState`, and `notes`.

Allowed states: `verified`, `partially_verified`, `unverified`, `conflicting`.

## Safety boundaries

- Never infer a deadline from a generic administrative-appeal convention.
- Never treat the decision date as the appeal deadline without authority support.
- Never assume exhaustion is required or waived.
- Never assume the first reviewer, hearing format, filing channel, or recipient.
- Never invent an agency contact address.
- Never present unsupported factual assertions as established facts.

## Readiness gate

Payment is blocked until the decision is identified, the agency/jurisdiction gap is surfaced or sufficiently resolved, procedural claims are supported or explicitly unresolved, material evidence gaps and contradictions are shown, the response strategy is coherent, independent validation passes, and the user approves the final response.

## SEO

Primary: `agency decision appeal`

Related: `appeal an agency decision`, `administrative agency appeal`, `government agency decision appeal`, `administrative decision review`, `challenge agency decision`, `agency decision appeal process`.
