import assert from "node:assert/strict";
import { test } from "node:test";
import { PDFDocument } from "pdf-lib";
import { buildPacket, computePacketTextHash } from "../src/platform/packet-builder";

test("buildPacket creates a real multi-part PDF in supplied order", async () => {
  const source = await PDFDocument.create();
  source.addPage([612, 792]);
  const sourceBytes = await source.save();

  const built = await buildPacket([
    { id: "draft", type: "ai_response", text: "Final response body", title: "Appeal Response" },
    { id: "evidence", type: "uploaded_document", filename: "evidence.pdf", mimeType: "application/pdf", bytes: sourceBytes },
  ]);

  const finalPdf = await PDFDocument.load(built.bytes);
  assert.equal(finalPdf.getPageCount(), 2);
  assert.equal(built.pageCount, 2);
  assert.equal(built.partHashes.length, 2);
  assert.equal(built.partHashes[0].id, "draft");
  assert.equal(built.partHashes[1].id, "evidence");
  assert.equal(built.partHashes[1].type, "uploaded_document");
  assert.equal(built.finalDraftHash, await computePacketTextHash("Final response body"));
});

test("buildPacket rejects empty drafts", async () => {
  await assert.rejects(
    () => buildPacket([{ id: "draft", type: "ai_response", text: "   " }]),
    /empty/,
  );
});
