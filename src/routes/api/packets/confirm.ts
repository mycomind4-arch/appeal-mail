import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseServer } from "@/platform/supabase";
import { requireUser } from "@/lib/auth-guard";
import { computePacketBytesHash } from "@/platform/packet-builder";

export const Route = createFileRoute("/api/packets/confirm")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const user = await requireUser(request);
          const body = await request.json() as { appealId?: string; packetId?: string };
          const appealId = String(body.appealId || "").trim();
          const packetId = String(body.packetId || "").trim();
          if (!appealId || !packetId) return Response.json({ error: "appealId and packetId are required." }, { status: 400 });

          const supabase = await getSupabaseServer();
          const { data: appeal, error: loadError } = await supabase
            .from("appeals")
            .select("id,user_id,draft,packet,status,updated_at")
            .eq("id", appealId)
            .eq("user_id", user.id)
            .single();

          if (loadError || !appeal) return Response.json({ error: "Appeal not found." }, { status: 404 });

          const packet = (appeal.packet && typeof appeal.packet === "object")
            ? appeal.packet as Record<string, unknown>
            : null;
          if (!packet || String(packet.id || "") !== packetId) {
            return Response.json({ error: "Packet not found." }, { status: 404 });
          }
          if (packet.locked === true) {
            return Response.json({ ok: true, alreadyLocked: true, packetId });
          }

          const expectedDraftHash = String(packet.finalDraftHash || "");
          const actualDraftHash = await computePacketBytesHash(new TextEncoder().encode(String(appeal.draft || "")));
          if (!expectedDraftHash || expectedDraftHash !== actualDraftHash) {
            return Response.json({ error: "The draft changed after packet assembly. Rebuild the packet before confirming it." }, { status: 409 });
          }

          const confirmedAt = new Date().toISOString();
          const lockedPacket = {
            ...packet,
            status: "locked",
            locked: true,
            confirmedByUserId: user.id,
            confirmedAt,
          };

          const { data: updated, error: updateError } = await supabase
            .from("appeals")
            .update({ packet: lockedPacket, updated_at: confirmedAt })
            .eq("id", appealId)
            .eq("user_id", user.id)
            .select("packet,updated_at")
            .single();

          if (updateError || !updated) {
            return Response.json({ error: "Unable to lock packet." }, { status: 409 });
          }

          return Response.json({
            ok: true,
            packetId,
            locked: true,
            confirmedByUserId: user.id,
            confirmedAt,
            documentSha256: String((updated.packet as Record<string, unknown>).documentSha256 || ""),
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to confirm packet.";
          return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 500 });
        }
      },
    },
  },
});
