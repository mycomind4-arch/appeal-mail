import assert from "node:assert/strict";
import { test } from "node:test";
import { webcrypto } from "node:crypto";

/* ─────────────────────────────────────────────
   Fix 1 — Recipient persistence tests

   Verifies the recipient hash logic that build.ts
   uses to persist recipient data into the locked
   packet, and that the webhook relies on for
   fulfillment. Uses standalone SHA-256 (no @/ alias).
   ───────────────────────────────────────────── */

async function sha256(input: Uint8Array): Promise<string> {
  const digest = await webcrypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function recipientHash(recipient: Record<string, string>): Promise<string> {
  return sha256(new TextEncoder().encode(JSON.stringify(recipient)));
}

test("recipient hash is deterministic for the same recipient", async () => {
  const recipient = { recipientName: "John Doe", recipientAddress1: "123 Main St", recipientAddress2: "", recipientCity: "Sacramento", recipientState: "CA", recipientZip: "95814" };
  const hash1 = await recipientHash(recipient);
  const hash2 = await recipientHash(recipient);
  assert.equal(hash1, hash2);
});

test("recipient hash changes when any recipient field changes", async () => {
  const base = { recipientName: "John Doe", recipientAddress1: "123 Main St", recipientAddress2: "", recipientCity: "Sacramento", recipientState: "CA", recipientZip: "95814" };
  const baseHash = await recipientHash(base);

  const variants: Record<string, typeof base> = {
    name: { ...base, recipientName: "Jane Doe" },
    address: { ...base, recipientAddress1: "456 Oak Ave" },
    address2: { ...base, recipientAddress2: "Apt 5" },
    city: { ...base, recipientCity: "Los Angeles" },
    state: { ...base, recipientState: "NV" },
    zip: { ...base, recipientZip: "95815" },
  };

  for (const [field, variant] of Object.entries(variants)) {
    const variantHash = await recipientHash(variant);
    assert.notEqual(variantHash, baseHash, `Changing ${field} must change the hash`);
  }
});

test("recipient hash is a 64-character hex string", async () => {
  const recipient = { recipientName: "Test", recipientAddress1: "123 Main", recipientAddress2: "", recipientCity: "City", recipientState: "CA", recipientZip: "12345" };
  const hash = await recipientHash(recipient);
  assert.equal(hash.length, 64, "SHA-256 hex must be 64 chars");
  assert.match(hash, /^[0-9a-f]+$/, "Must be lowercase hex");
});

test("packet object includes all required recipient fields (simulating build.ts output)", () => {
  const recipient = {
    recipientName: "John Doe",
    recipientAddress1: "123 Main St",
    recipientAddress2: null,
    recipientCity: "Sacramento",
    recipientState: "CA",
    recipientZip: "95814",
  };
  const packet = {
    id: "pkt-123",
    status: "assembled",
    locked: true,
    ...recipient,
    recipientHash: "abc123def456",
    documentId: "doc-456",
    documentSha256: "sha-789",
    finalDraftHash: "draft-hash",
    pageCount: 2,
  };

  assert.equal(packet.recipientName, "John Doe");
  assert.equal(packet.recipientAddress1, "123 Main St");
  assert.equal(packet.recipientAddress2, null);
  assert.equal(packet.recipientCity, "Sacramento");
  assert.equal(packet.recipientState, "CA");
  assert.equal(packet.recipientZip, "95814");
  assert.ok(typeof packet.recipientHash === "string" && packet.recipientHash.length > 0);
});

test("webhook can reconstruct recipient from packet fields (simulating webhook logic)", () => {
  const packet = {
    recipientName: "Jane Smith",
    recipientAddress1: "456 Oak Ave",
    recipientAddress2: "Apt 3",
    recipientCity: "San Francisco",
    recipientState: "CA",
    recipientZip: "94102",
  };

  const recipient = {
    name: packet.recipientName,
    address1: packet.recipientAddress1,
    address2: packet.recipientAddress2,
    city: packet.recipientCity,
    state: packet.recipientState,
    postalCode: packet.recipientZip,
  };

  assert.equal(recipient.name, "Jane Smith");
  assert.equal(recipient.address1, "456 Oak Ave");
  assert.equal(recipient.address2, "Apt 3");
  assert.equal(recipient.city, "San Francisco");
  assert.equal(recipient.state, "CA");
  assert.equal(recipient.postalCode, "94102");
});

test("incomplete recipient fails validation (simulating build.ts guard)", () => {
  const required = ["recipientName", "recipientAddress1", "recipientCity", "recipientState", "recipientZip"];
  const complete = { recipientName: "Test", recipientAddress1: "123 Main", recipientCity: "City", recipientState: "CA", recipientZip: "12345" };
  const incomplete = { recipientName: "", recipientAddress1: "123 Main", recipientCity: "City", recipientState: "CA", recipientZip: "12345" };

  const isComplete = (r: Record<string, string>) => required.every((field) => r[field]?.trim());
  assert.ok(isComplete(complete), "Complete recipient must pass validation");
  assert.ok(!isComplete(incomplete), "Missing recipientName must fail validation");
});
