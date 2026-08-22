# Social Security Overpayment Appeal — Gold Standard

## Authority-first behavior
This workflow handles Social Security overpayment notices by separating three materially different requests: reconsideration when the amount/fact of overpayment is disputed, waiver when the overpayment is accepted but recovery relief is sought, and repayment-rate changes when repayment is unaffordable. Official SSA guidance controls. The workflow does not invent facts, amounts, deadlines, recipients, or form requirements.

## Pipeline
`upload → classify → extract → authority resolve → overpayment amount/period/reason review → route reconsideration/waiver/repayment → deadline check → evidence → contradictions → timeline → stress test → strategy → draft → independent validation → readiness → human approval → price → deterministic PDF → Stripe → MailMyPDF → provider → proof`

## Authority sources
- SSA Form SSA-561 Request for Reconsideration
- SSA Form SSA-632 Request for Waiver of Overpayment Recovery
- SSA Overpayments guidance
- SSA POMS GN 02201.025 / SI 02220.017 for overpayment reconsideration

Current source verification is required before production use; source records are preserved with claim, URL, title, jurisdiction, effective date, retrieval timestamp, and verification state.

## Pricing
Starting price is based on a $27.99 preparation fee, three included response pages, additional response sheets at $0.40, supporting-document sheets at $0.25, plus the selected mailing service. Exact pricing is calculated from the final approved packet before payment.
