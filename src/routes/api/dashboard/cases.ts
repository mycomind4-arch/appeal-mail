import { createFileRoute } from "@tanstack/react-router";
import { getSupabaseServer } from "@/platform/supabase";
import { requireUser } from "@/lib/auth-guard";

export const Route = createFileRoute("/api/dashboard/cases")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const user = await requireUser(request);
          const supabase = await getSupabaseServer();
          const { data, error } = await supabase.from("appeals").select("id,workflow_id,status,decision,draft,packet,created_at,updated_at").eq("user_id", user.id).order("updated_at", { ascending: false });
          if (error) throw new Error(error.message);
          return Response.json({ ok: true, cases: (data || []).map((item) => ({
            id: item.id,
            workflowId: item.workflow_id,
            status: item.status,
            title: (item.decision as any)?.type || item.workflow_id,
            referenceNumber: (item.decision as any)?.referenceNumber || null,
            decisionDate: (item.decision as any)?.decisionDate || null,
            documentId: (item.packet as any)?.documentId || null,
            pageCount: Number((item.packet as any)?.pageCount || 0),
            locked: Boolean((item.packet as any)?.locked),
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          })) });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unable to load cases.";
          return Response.json({ error: message }, { status: /authentication|required|token/i.test(message) ? 401 : 500 });
        }
      },
    },
  },
});
