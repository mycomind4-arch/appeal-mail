import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { LICENSING_APPEAL_PRICING, calculateLicensingAppealTotal } from "../src/domain/licensing-appeal-pricing.ts";

test("licensing appeal uses transparent Gold packet pricing", () => {
  assert.equal(LICENSING_APPEAL_PRICING.preparationFee, 29.99);
  assert.equal(LICENSING_APPEAL_PRICING.includedResponsePages, 4);
  assert.equal(calculateLicensingAppealTotal({ responseSheets: 4, supportingSheets: 0, mailingMethod: "certified" }).total, 42.48);
  assert.equal(calculateLicensingAppealTotal({ responseSheets: 6, supportingSheets: 8, mailingMethod: "certified" }).total, 44.48);
});

test("licensing appeal landing page and checkout use the approved packet pricing", async () => {
  const route = await readFile("src/routes/workflows/licensing-appeal.tsx", "utf8");
  const pricing = await readFile("src/components/workflow/licensing-appeal-pricing.tsx", "utf8");
  const checkout = await readFile("src/routes/api/workflows/licensing-appeal/checkout.ts", "utf8");
  const approval = await readFile("src/routes/api/workflows/licensing-appeal/approve.ts", "utf8");
  assert.match(route, /LicensingAppealPricing/);
  assert.match(pricing, /\$29\.99/);
  assert.match(pricing, /\$0\.40/);
  assert.match(pricing, /\$0\.25/);
  assert.match(approval, /calculateLicensingAppealTotal/);
  assert.match(checkout, /appeal\.packet\.pricing\.total/);
});
