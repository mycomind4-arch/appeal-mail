import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseServer } from "@/platform/supabase";
import { requireUser } from "@/lib/auth-guard";
import { uploadDocument } from "@/platform/mailmypdf";
import { buildPacket, type PacketPageOp, type PacketPart } from "@/platform/packet-builder";

interface PacketPartInput { id: string; type: "ai_response" | "uploaded_document" | "generated_document"; filename?: string; mimeType?: string; title?: string; }

export const Route = createFileRoute("/api/packets/build")({ server: { handlers: { POST: async ({ request }) => {
  try {
    const user = await requireUser(request);
    const form = await request.formData();
    const appealId = String(form.get("appealId") || "").trim();
    const workflowId = String(form.get("workflowId") || "").trim();
    const draft = String(form.get("draft") || "");
    const rawParts = String(form.get("parts") || "[]");
    const rawOps = String(form.get("pageOps") || "[]");
    if (!appealId || !workflowId) return Response.json({ error: "appealId and workflowId are required." }, { status: 400 });
    let partInputs: PacketPartInput[]; let pageOps: PacketPageOp[];
    try { partInputs = JSON.parse(rawParts); pageOps = JSON.parse(rawOps); } catch { return Response.json({ error: "parts and pageOps must be valid JSON." }, { status: 400 }); }
    if (!Array.isArray(partInputs) || !partInputs.length) return Response.json({ error: "At least one packet part is required." }, { status: 400 });
    if (!Array.isArray(pageOps)) return Response.json({ error: "pageOps must be an array." }, { status: 400 });
    if (partInputs.filter((part) => part.type === "ai_response").length !== 1) return Response.json({ error: "Packet must contain exactly one final AI response part." }, { status: 400 });

    const supabase = await getSupabaseServer();
    const { data: appeal, error: appealError } = await supabase.from("appeals").select("id,user_id,workflow_id,packet").eq("id", appealId).eq("user_id", user.id).single();
    if (appealError || !appeal) return Response.json({ error: "Appeal not found." }, { status: 404 });
    if (appeal.workflow_id !== workflowId) return Response.json({ error: "Workflow does not match the appeal." }, { status: 409 });
    if (!draft.trim()) return Response.json({ error: "A final edited draft is required before packet assembly." }, { status: 400 });

    const parts: PacketPart[] = []; const uploadedMetadata: Array<{ id: string; filename: string; mimeType: string; size: number; documentId: string; sha256: string }> = [];
    for (const input of partInputs) {
      if (!input?.id || !input.type) return Response.json({ error: "Every packet part requires an id and type." }, { status: 400 });
      if (input.type === "ai_response") { parts.push({ id: input.id, type: "ai_response", text: draft, title: input.title || "Appeal Response" }); continue; }
      const formValue = form.get(`file:${input.id}`);
      if (!(formValue instanceof File)) return Response.json({ error: `Missing file for packet part ${input.id}.` }, { status: 400 });
      const mimeType = input.mimeType || formValue.type; const filename = input.filename || formValue.name; const bytes = new Uint8Array(await formValue.arrayBuffer());
      if (input.type === "uploaded_document") parts.push({ id: input.id, type: "uploaded_document", filename, mimeType, bytes });
      else { if (mimeType !== "application/pdf") return Response.json({ error: "Generated document packet parts must be PDF files." }, { status: 415 }); parts.push({ id: input.id, type: "generated_document", filename, mimeType: "application/pdf", bytes }); }
      const sourceDocument = await uploadDocument(new File([bytes], filename, { type: mimeType }));
      uploadedMetadata.push({ id: input.id, filename, mimeType, size: bytes.byteLength, documentId: sourceDocument.id, sha256: sourceDocument.sha256 });
    }

    const built = await buildPacket(parts, pageOps);
    const packetId = String((appeal.packet as Record<string, unknown> | null)?.id || crypto.randomUUID());
    const finalFilename = `${workflowId}-${appealId}-final-packet.pdf`;
    const uploaded = await uploadDocument(new File([built.bytes], finalFilename, { type: "application/pdf" }));
    const assembledAt = new Date().toISOString();
    const packet = {
      ...((appeal.packet as Record<string, unknown> | null) || {}), id: packetId, status: "assembled", locked: true,
      documentId: uploaded.id, documentFilename: uploaded.filename, documentSha256: uploaded.sha256, documentSizeBytes: built.bytes.byteLength,
      finalDraftHash: built.finalDraftHash, attachmentHashes: built.partHashes.filter((part) => part.type !== "ai_response").map((part) => part.sha256),
      partHashes: built.partHashes, orderedParts: partInputs.map((part) => ({ id: part.id, type: part.type, filename: part.filename || null })),
      pageOps, uploadedParts: uploadedMetadata, pageCount: built.pageCount, assembledAt, confirmedByUserId: user.id,
    };
    const { error: updateError } = await supabase.from("appeals").update({ draft, packet, status: "ready", updated_at: assembledAt }).eq("id", appealId).eq("user_id", user.id);
    if (updateError) throw new Error(`Unable to persist final packet: ${updateError.message}`);
    return Response.json({ ok: true, appealId, workflowId, packetId, documentId: uploaded.id, documentSha256: uploaded.sha256, finalDraftHash: built.finalDraftHash, attachmentHashes: packet.attachmentHashes, pageCount: built.pageCount, locked: true, assembledAt });
  } catch (error) {
    if (error instanceof Response) return error;
    const message = error instanceof Error ? error.message : "Unable to assemble packet.";
    const status = /authentication|unauthorized|ownership/i.test(message) ? 401 : 500;
    return Response.json({ error: message }, { status });
  }
} } });
