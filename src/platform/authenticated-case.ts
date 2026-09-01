import { createServerFn } from "@tanstack/react-start";
import { loadAppeal } from "@/platform/appeal-repository";
import { requireAuthenticatedUser } from "@/platform/supabase";

export const loadAuthenticatedCase = createServerFn()
  .validator((input: { caseId: string; accessToken: string }) => input)
  .handler(async ({ data }) => {
    const user = await requireAuthenticatedUser(new Request("https://appeal-mail.internal/auth", {
      headers: { authorization: `Bearer ${data.accessToken}` },
    }));
    return loadAppeal({ data: { id: data.caseId, userId: user.id } });
  });
