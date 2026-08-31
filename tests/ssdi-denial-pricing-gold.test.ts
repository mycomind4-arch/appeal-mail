import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { SSDI_DENIAL_PRICING, calculateSsdiDenialTotal } from "../src/domain/ssdi-denial-pricing.ts";

test("SSDI denial uses transparent Gold packet pricing", () => {
  assert.equal(SSDI_DENIAL_PRICING.preparationFee, 24.99);
  assert.equal(SSDI_DENIAL_PRICING.includedResponsePages, 3);
  assert.equal(calculateSsdiDenialTotal({ responseSheets: 3, supportingSheets: 0, mailingMethod: "certified" }).total, 37.48);
  assert.equal(calculateSsdiDenialTotal({ responseSheets: 5, supportingSheets: 8, mailingMethod: "certified" }).total, 40.28);
});

test("SSDI landing and checkout expose the same pricing contract", async () => {
  const route = await readFile("src/routes/workflows/ssdi-denial.tsx", "utf8");
  const pricing = await readFile("src/components/workflow/ssdi-denial-pricing.tsx", "utf8");
  const approve = await readFile("src/routes/api/workflows/ssdi-denial/approve.ts", "utf8");
  const checkout = await readFile("src/routes/api/workflows/ssdi-denial/checkout.ts", "utf8");
  assert.match(route, /SsdiDenialPricing/);
  assert.match(pricing, /getWorkflowPricingProfile/);
  assert.match(pricing, /PRICES/);
  assert.match(pricing, /certified/);
  assert.match(approve, /calculateSsdiDenialTotal/);
  assert.match(checkout, /totalCents/);
});
