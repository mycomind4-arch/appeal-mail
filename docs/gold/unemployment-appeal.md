# Gold Standard — Unemployment Appeal

Workflow `unemployment-appeal` is an authority-first P03 appeal workflow.

## Authority model
- State/agency-specific procedures are resolved from the source notice and current official agency material.
- No universal unemployment deadline, appeal forum, form, recipient, filing method, hearing rule, exhaustion requirement, or outcome is inferred.
- Claimant benefit issues, overpayment issues, employer charges, and second-level review remain distinct.
- Current official sources include the U.S. Department of Labor unemployment-insurance portal plus agency-specific sources when jurisdiction is identified.

## Pipeline
Secure ingest -> classify -> extract -> authority resolution -> deadline verification -> evidence/contradictions -> strategy -> Gemini draft -> independent Gemini validation -> human approval -> custom pricing -> Stripe -> deterministic PDF -> MailMyPDF -> provider -> tracking -> proof.

## Pricing
Preparation $24.99 includes 3 response pages. Additional response sheets are $0.40 each; supporting-document sheets are $0.25 each. Standard, certified, certified+return-receipt, registered, and large-packet pricing are shown before payment. Final price is calculated from the approved physical packet.

## Certification
`tests/unemployment-appeal-gold.test.ts` verifies the Gold contract, pricing, Gemini, validation, MailMyPDF, and proof boundaries. CI is the final certification gate.
