# Appeals Council Appeal — Supreme Authority Gold Standard

Workflow ID: `appeals-council`

## Authority-first rule
The workflow is for review of an SSA Administrative Law Judge hearing decision or dismissal. SSA's current guidance states that an Appeals Council review request is generally due within 60 days after receipt of the hearing decision, with a five-day receipt presumption unless later receipt is shown. The actual notice and current SSA sources remain controlling. See official sources: https://www.ssa.gov/apply/appeal-decision-we-made/request-review-hearing-decision and https://www.ssa.gov/forms/ha-520.html.

## Evidence rule
The workflow distinguishes record evidence from additional evidence. SSA states that additional evidence relating to the period on or before the hearing decision must be identified/submitted and that the Appeals Council considers additional evidence under governing rules. The workflow must not promise that any specific evidence will be considered or change the outcome.

## Executable pipeline
`upload → classify → extract → authority-resolve → deadline-check → hearing-decision analysis → grounds → evidence/new-evidence analysis → contradictions → timeline → Gemini draft → separate Gemini validation → readiness → human approval → price calculation → Stripe → deterministic PDF → MailMyPDF → provider → tracking → proof`

## Pricing
Preparation $34.99 includes 4 response pages. Extra response B&W sheets $0.45 each. Supporting-document B&W sheets $0.25 each. Standard $5.49, Certified $12.99, Certified + return receipt $15.99, Registered $29.99. Flat/large packet surcharge $2.50 when required. Exact price is calculated from the approved physical packet before checkout.

## Safety boundaries
Never invent claimant facts, medical evidence, vocational facts, deadlines, recipients, forms, filing methods, new-evidence eligibility, or outcomes. Never present review as guaranteed.

## Landing page
The public page is the authority hub and execution entry point and includes source education, timing, evidence, common errors, workflow explanation, pricing, mailing/proof, and the execution CTA.
