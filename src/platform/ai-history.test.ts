import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";

describe("AI history hashing contract", () => {
  it("uses SHA-256 for deterministic provenance hashes", () => {
    expect(createHash("sha256").update("appeal-mail").digest("hex")).toMatch(/^[0-9a-f]{64}$/);
  });
});
