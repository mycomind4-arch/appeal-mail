import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { AGENCY_DECISION_PRICING, calculateAgencyDecisionTotal } from "../src/domain/agency-decision-pricing.ts";

test("agency decision uses transparent Gold packet pricing", () => {
  assert.equal(AGENCY_DECISION_PRICING.preparationFee, 24.99);
  assert.equal(AGENCY_DECISION_PRICING.includedResponsePages, 3);
  assert.equal(calculateAgencyDecisionTotal({ responseSheets: 3, supportingSheets: 0, mailingMethod: "certified" }).total, 37.48);
  assert.equal(calculateAgencyDecisionTotal({ responseSheets: 5, supportingSheets: 8, mailingMethod: "certified" }).total, 40.68);
});

test("agency decision landing page and server checkout expose the same pricing model", async () => {
  const route = await readFile("src/routes/workflows/agency-decision.tsx", "utf8");
  const pricing = await readFile("src/components/workflow/agency-decision-pricing.tsx", "utf8");
  const checkout = await readFile("src/routes/api/workflows/agency-decision/checkout.ts", "utf8");
  const approval = await readFile("src/routes/api/workflows/agency-decision/approve.ts", "utf8");
  assert.match(route, /AgencyDecisionPricing/);
  assert.match(pricing, /\$24\.99/);
  assert.match(pricing, /\$0\.40/);
  assert.match(pricing, /\$0\.25/);
  assert.match(approval, /calculateAgencyDecisionTotal/);
  assert.match(checkout, /pricing\.total/);
});
