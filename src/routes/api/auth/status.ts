import { createAPIFileRoute } from "@tanstack/react-start";
import { getAuthStatus } from "@/lib/auth-guard";

/* Returns auth configuration status — public endpoint */
export const APIRoute = createAPIFileRoute("/api/auth/status")({
  GET: async ({ request }) => {
    const status = await getAuthStatus(request);
    return Response.json(status);
  },
});
