import assert from "node:assert/strict";
import test from "node:test";
import { WORKERS_COMP_APPEAL_GOLD, WORKERS_COMP_APPEAL_PRICING, WORKERS_COMP_CAPABILITIES } from "../src/domain/workers-comp-appeal-gold.ts";

test("Workers' Compensation Gold contract is complete",()=>{
  assert.equal(WORKERS_COMP_APPEAL_GOLD.workflowId,"workers-comp-appeal");
  assert.equal(WORKERS_COMP_APPEAL_GOLD.lifecycle,"authority");
  for(const capability of WORKERS_COMP_CAPABILITIES) assert.ok(WORKERS_COMP_APPEAL_GOLD.capabilities.includes(capability));
  assert.ok(WORKERS_COMP_APPEAL_GOLD.authorityRules.some(rule=>rule.includes("Never invent workers' compensation deadlines")));
  assert.equal(WORKERS_COMP_APPEAL_PRICING.preparationFee,34.99);
  assert.equal(WORKERS_COMP_APPEAL_PRICING.includedResponsePages,4);
});

test("Workers' Compensation executable boundaries are wired",async()=>{
  const fs=await import("node:fs/promises");
  const files=await Promise.all([
    fs.readFile("src/routes/workflows/workers-comp-appeal.tsx","utf8"),
    fs.readFile("src/routes/api/workflows/workers-comp-appeal/analyze.ts","utf8"),
    fs.readFile("src/routes/api/workflows/workers-comp-appeal/draft.ts","utf8"),
    fs.readFile("src/routes/api/workflows/workers-comp-appeal/validate.ts","utf8"),
    fs.readFile("src/routes/api/workflows/workers-comp-appeal/approve.ts","utf8"),
    fs.readFile("src/routes/api/workflows/workers-comp-appeal/checkout.ts","utf8"),
    fs.readFile("src/routes/api/stripe-webhook.ts","utf8"),
  ]);
  const source=files.join("\n");
  assert.match(source,/workers-comp-appeal/);
  assert.match(source,/Gemini/);
  assert.match(source,/MailMyPDF/);
  assert.match(source,/proof/i);
  assert.match(source,/34\.99/);
  assert.match(source,/0\.45/);
  assert.match(source,/0\.25/);
  assert.match(source,/independent/i);
});
