import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseServer } from "@/platform/supabase";
import { requireUser } from "@/lib/auth-guard";

const MAX_DRAFT_LENGTH = 100_000;

export const Route = createFileRoute("/api/cases/$caseId/draft")({
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        try {
          const user = await requireUser(request);
          const caseId = String(params.caseId || "").trim();
          if (!caseId) return Response.json({ error: "Case ID is required." }, { status: 400 });

          const body = await request.json() as { draft?: unknown };
          const draft = typeof body.draft === "string" ? body.draft : "";
          if (!draft.trim()) return Response.json({ error: "A draft is required." }, { status: 400 });
          if (draft.length > MAX_DRAFT_LENGTH) return Response.json({ error: "Draft is too large." }, { status: 413 });

          const supabase = await getSupabaseServer();
          const { data: existing, error: loadError } = await supabase
            .from("appeals")
            .select("id,user_id,version,packet,status")
            .eq("id", caseId)
            .eq("user_id", user.id)
            .single();

          if (loadError || !existing) {
            return Response.json({ error: "Case not found." }, { status: 404 });
          }

          // A draft mutation invalidates the previously assembled packet. The user
          // must rebuild and explicitly confirm a new packet before mailing.
          const nextStatus = existing.status === "mailed" || existing.status === "delivered"
            ? existing.status
            : "in_progress";
          const nextPacket = existing.status === "mailed" || existing.status === "delivered"
            ? existing.packet
            : null;
          const nextVersion = Number(existing.version || 0) + 1;

          const { data: updated, error: updateError } = await supabase
            .from("appeals")
            .update({
              draft,
              packet: nextPacket,
              status: nextStatus,
              version: nextVersion,
              updated_at: new Date().toISOString(),
            })
            .eq("id", caseId)
            .eq("user_id", user.id)
            .eq("version", Number(existing.version || 0))
            .select("id,version,status,packet,updated_at")
            .single();

          if (updateError || !updated) {
            return Response.json({ error: "Case changed while saving the draft. Reload and try again." }, { status: 409 });
          }

          return Response.json({
            ok: true,
            caseId,
            version: updated.version,
            status: updated.status,
            packetInvalidated: !nextPacket,
            packet: updated.packet,
            updatedAt: updated.updated_at,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to save draft.";
          return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 500 });
        }
      },
    },
  },
});
