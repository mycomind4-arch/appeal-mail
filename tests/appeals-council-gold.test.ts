import assert from "node:assert/strict";
import test from "node:test";
import { APPEALS_COUNCIL_GOLD, APPEALS_COUNCIL_CAPABILITIES, APPEALS_COUNCIL_PRICING, APPEALS_COUNCIL_AUTHORITY_SOURCES } from "../src/domain/appeals-council-gold.ts";

test("Appeals Council Gold contract is complete",()=>{
  assert.equal(APPEALS_COUNCIL_GOLD.workflowId,"appeals-council");
  assert.equal(APPEALS_COUNCIL_GOLD.lifecycle,"authority");
  for(const capability of APPEALS_COUNCIL_CAPABILITIES) assert.ok(APPEALS_COUNCIL_GOLD.capabilities.includes(capability));
  assert.ok(APPEALS_COUNCIL_GOLD.authorityRules.includes("Never invent an Appeals Council deadline or filing method."));
  assert.equal(APPEALS_COUNCIL_PRICING.preparationFee,34.99);
  assert.equal(APPEALS_COUNCIL_PRICING.includedResponsePages,4);
  assert.ok(APPEALS_COUNCIL_AUTHORITY_SOURCES.length>=4);
});

test("Appeals Council executable boundaries and pricing are wired",async()=>{
  const fs=await import("node:fs/promises");
  const files=await Promise.all([
    fs.readFile("src/routes/workflows/appeals-council.tsx","utf8"),
    fs.readFile("src/routes/api/workflows/appeals-council/analyze.ts","utf8"),
    fs.readFile("src/routes/api/workflows/appeals-council/draft.ts","utf8"),
    fs.readFile("src/routes/api/workflows/appeals-council/validate.ts","utf8"),
    fs.readFile("src/routes/api/workflows/appeals-council/approve.ts","utf8"),
    fs.readFile("src/routes/api/workflows/appeals-council/checkout.ts","utf8"),
  ]);
  const source=files.join("\n");
  assert.match(source,/appeals-council/);
  assert.match(source,/Gemini/);
  assert.match(source,/MailMyPDF/);
  assert.match(source,/proof/i);
  assert.match(source,/34\.99/);
  assert.match(source,/0\.45/);
  assert.match(source,/0\.25/);
  assert.match(source,/independent/i);
});
