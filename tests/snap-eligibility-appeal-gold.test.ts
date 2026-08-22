import assert from "node:assert/strict";
import test from "node:test";
import { SNAP_ELIGIBILITY_APPEAL_GOLD, SNAP_ELIGIBILITY_APPEAL_PRICING, SNAP_ELIGIBILITY_APPEAL_AUTHORITY_SOURCES } from "../src/domain/snap-eligibility-appeal-gold.ts";

test("SNAP eligibility Gold contract is complete",()=>{
  assert.equal(SNAP_ELIGIBILITY_APPEAL_GOLD.workflowId,"snap-eligibility-appeal");
  assert.equal(SNAP_ELIGIBILITY_APPEAL_GOLD.lifecycle,"authority");
  assert.ok(SNAP_ELIGIBILITY_APPEAL_GOLD.capabilities.includes("eligibility-analysis"));
  assert.ok(SNAP_ELIGIBILITY_APPEAL_GOLD.capabilities.includes("pricing"));
  assert.ok(SNAP_ELIGIBILITY_APPEAL_GOLD.capabilities.includes("proof"));
  assert.ok(SNAP_ELIGIBILITY_APPEAL_GOLD.authorityRules.includes("Never invent SNAP eligibility facts or household circumstances."));
  assert.equal(SNAP_ELIGIBILITY_APPEAL_PRICING.preparationFee,26.99);
  assert.equal(SNAP_ELIGIBILITY_APPEAL_PRICING.includedResponsePages,3);
  assert.ok(SNAP_ELIGIBILITY_APPEAL_AUTHORITY_SOURCES.length>=3);
});

test("SNAP eligibility executable boundaries are wired",async()=>{
  const fs=await import("node:fs/promises");
  const files=await Promise.all([
    fs.readFile("src/routes/workflows/snap-eligibility-appeal.tsx","utf8"),
    fs.readFile("src/routes/api/workflows/snap-eligibility-appeal/analyze.ts","utf8"),
    fs.readFile("src/routes/api/workflows/snap-eligibility-appeal/draft.ts","utf8"),
    fs.readFile("src/routes/api/workflows/snap-eligibility-appeal/validate.ts","utf8"),
    fs.readFile("src/routes/api/workflows/snap-eligibility-appeal/approve.ts","utf8"),
    fs.readFile("src/routes/api/workflows/snap-eligibility-appeal/checkout.ts","utf8"),
    fs.readFile("src/routes/api/stripe-webhook.ts","utf8"),
  ]);
  const source=files.join("\n");
  assert.match(source,/snap-eligibility-appeal/);
  assert.match(source,/Gemini/);
  assert.match(source,/independent/i);
  assert.match(source,/MailMyPDF/);
  assert.match(source,/proof/i);
  assert.match(source,/26\.99/);
  assert.match(source,/0\.25/);
  assert.match(source,/0\.4/);
});
