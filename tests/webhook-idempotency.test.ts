import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createMemoryIdempotencyStore,
  webhookKey,
} from "../node_modules/@mailmypdf/runtime/dist/idempotency.js";

/* ─────────────────────────────────────────────
   Fix 2 — Webhook idempotency lifecycle tests

   These verify the three-state lifecycle:
     pending → complete (success, deduplicate on retry)
     pending → released (failure, retryable on next delivery)
   This is the behavior the fixed stripe-webhook.ts relies on.
   ───────────────────────────────────────────── */

function createTrackedIdempotencyStore() {
  // Wraps the memory store to track release calls
  const store = createMemoryIdempotencyStore();
  const releases: string[] = [];
  return {
    ...store,
    release(key: string) {
      releases.push(key);
      return store.release(key);
    },
    getReleases() {
      return [...releases];
    },
  };
}

test("reserve returns true for a new key", async () => {
  const store = createMemoryIdempotencyStore();
  const key = webhookKey("evt_001");
  const claimed = await store.reserve(key);
  assert.equal(claimed, true);
});

test("reserve returns false for an already-reserved key (deduplicates concurrent deliveries)", async () => {
  const store = createMemoryIdempotencyStore();
  const key = webhookKey("evt_002");
  await store.reserve(key);
  const second = await store.reserve(key);
  assert.equal(second, false, "Second delivery must be deduplicated");
});

test("release allows a failed key to be retried", async () => {
  const store = createMemoryIdempotencyStore();
  const key = webhookKey("evt_003");
  // First delivery: reserve succeeds
  const first = await store.reserve(key);
  assert.equal(first, true);
  // Fulfillment fails: release the key (what the fixed webhook does)
  await store.release(key);
  // Stripe retries: reserve should succeed again
  const retry = await store.reserve(key);
  assert.equal(retry, true, "After release, retry must be able to reserve");
});

test("store without release keeps the key reserved (success → deduplicate)", async () => {
  const store = createMemoryIdempotencyStore();
  const key = webhookKey("evt_004");
  await store.reserve(key);
  // Fulfillment succeeds: store the result (key stays reserved)
  await store.store(key, { processed: true });
  // Stripe retries: must be deduplicated
  const retry = await store.reserve(key);
  assert.equal(retry, false, "After successful store, retry must be deduplicated");
});

test("simulated webhook flow: success path reserves and stores, no release", async () => {
  const store = createTrackedIdempotencyStore();
  const key = webhookKey("evt_success");
  // Simulate: reserve → process → store (success)
  const claimed = await store.reserve(key);
  assert.equal(claimed, true);
  await store.store(key, { processed: true });
  // No release called on success
  assert.equal(store.getReleases().length, 0, "No release on success");
  // Retry is deduplicated
  const retry = await store.reserve(key);
  assert.equal(retry, false);
});

test("simulated webhook flow: failure path reserves then releases for retry", async () => {
  const store = createTrackedIdempotencyStore();
  const key = webhookKey("evt_fail");
  // Simulate: reserve → process → catch (failure) → release
  const claimed = await store.reserve(key);
  assert.equal(claimed, true);
  // Fulfillment throws — release the key
  await store.release(key);
  assert.equal(store.getReleases().length, 1, "Release called on failure");
  // Stripe retry can now re-reserve
  const retry = await store.reserve(key);
  assert.equal(retry, true, "Retry after failure can re-reserve");
});

test("simulated webhook flow: fail then retry succeeds", async () => {
  const store = createMemoryIdempotencyStore();
  const key = webhookKey("evt_fail_then_success");
  // First delivery: reserve → fail → release
  await store.reserve(key);
  await store.release(key);
  // Second delivery (Stripe retry): reserve → succeed → store
  const retry = await store.reserve(key);
  assert.equal(retry, true);
  await store.store(key, { processed: true });
  // Third delivery (another duplicate): deduplicated
  const duplicate = await store.reserve(key);
  assert.equal(duplicate, false);
});

test("multiple different events can be processed independently", async () => {
  const store = createMemoryIdempotencyStore();
  const key1 = webhookKey("evt_a");
  const key2 = webhookKey("evt_b");
  assert.equal(await store.reserve(key1), true);
  assert.equal(await store.reserve(key2), true);
  // Both are independent
  assert.equal(await store.reserve(key1), false);
  assert.equal(await store.reserve(key2), false);
});

test("released key can be re-released without error", async () => {
  const store = createMemoryIdempotencyStore();
  const key = webhookKey("evt_double_release");
  await store.reserve(key);
  await store.release(key);
  // Double release should be idempotent (no throw)
  await store.release(key);
  const retry = await store.reserve(key);
  assert.equal(retry, true);
});
