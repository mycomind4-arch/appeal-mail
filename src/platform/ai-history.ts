import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServer, requireAuthenticatedUser } from "@/platform/supabase";

export type AIHistoryEvent = {
  caseId: string;
  ownerId: string;
  task: "analysis" | "draft" | "revision";
  provider: string;
  model: string;
  inputHash: string;
  outputHash: string;
  occurredAt: string;
};

async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const appendAIHistory = createServerFn()
  .validator((input: { accessToken: string; caseId: string; task: AIHistoryEvent["task"]; provider: string; model: string; input: string; output: string }) => input)
  .handler(async ({ data }) => {
    const user = await requireAuthenticatedUser(new Request("https://appeal-mail.internal/auth", {
      headers: { authorization: `Bearer ${data.accessToken}` },
    }));
    const db = await getSupabaseServer();
    const event: AIHistoryEvent = {
      caseId: data.caseId,
      ownerId: user.id,
      task: data.task,
      provider: data.provider,
      model: data.model,
      inputHash: await sha256(data.input),
      outputHash: await sha256(data.output),
      occurredAt: new Date().toISOString(),
    };
    const { error } = await db.from("audit_events").insert({
      event_type: `ai.${event.task}`,
      actor: "ai",
      subject_id: event.caseId,
      owner_id: event.ownerId,
      occurred_at: event.occurredAt,
      metadata: event,
    });
    if (error) throw new Error(`Failed to persist AI history: ${error.message}`);
    return event;
  });
