import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { APPEAL_CATALOG } from "../src/domain/appeal-catalog";
import { isWorkflowId } from "../src/domain/workflows";

describe("Workflow routing integrity", () => {
  test("every catalog workflowRoute resolves to a runtime workflow", () => {
    for (const entry of APPEAL_CATALOG) {
      const workflowId = entry.workflowRoute.replace(/^\/workflows\//, "");
      assert.ok(workflowId, `Missing workflow id for ${entry.slug}`);
      assert.ok(isWorkflowId(workflowId), `${entry.slug} points to unknown runtime workflow '${workflowId}'`);
    }
  });

  test("every catalog route has the canonical /appeal/<slug> shape", () => {
    for (const entry of APPEAL_CATALOG) {
      assert.equal(entry.route, `/appeal/${entry.slug}`, `Non-canonical route for ${entry.slug}`);
    }
  });

  test("catalog slugs stay unique", () => {
    const slugs = APPEAL_CATALOG.map((entry) => entry.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });
});
