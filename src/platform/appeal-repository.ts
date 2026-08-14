import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServer } from "./supabase";
import type { Appeal } from "@/domain/appeal";

/* ─────────────────────────────────────────────
   Appeal Repository — server functions for
   persisting and retrieving appeals via Supabase.
   ───────────────────────────────────────────── */

/* Save (insert or update) an appeal */
export const saveAppeal = createServerFn()
  .validator((input: { appeal: Appeal; userId?: string }) => input)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServer();
    const { appeal, userId } = data;

    const row = {
      id: appeal.id,
      user_id: userId || null,
      workflow_id: appeal.workflowId,
      status: appeal.status,
      decision: appeal.decision,
      grounds: appeal.grounds,
      evidence: appeal.evidence,
      arguments: appeal.arguments,
      draft: appeal.draft,
      review: appeal.review || null,
      packet: appeal.packet || null,
      proof: appeal.proof || null,
      timeline: appeal.timeline,
      created_at: appeal.createdAt,
      updated_at: new Date().toISOString(),
    };

    const { data: result, error } = await supabase
      .from("appeals")
      .upsert(row, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save appeal: ${error.message}`);
    }

    return { id: result.id, saved: true };
  });

/* Load a single appeal by ID */
export const loadAppeal = createServerFn()
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServer();
    const { data: row, error } = await supabase
      .from("appeals")
      .select("*")
      .eq("id", data.id)
      .single();

    if (error) {
      throw new Error(`Failed to load appeal: ${error.message}`);
    }

    return rowToAppeal(row);
  });

/* List appeals for a user */
export const listAppeals = createServerFn()
  .validator((input: { userId: string; limit?: number; offset?: number }) => input)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServer();
    const limit = data.limit || 50;
    const offset = data.offset || 0;

    const { data: rows, error } = await supabase
      .from("appeals")
      .select("*")
      .eq("user_id", data.userId)
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to list appeals: ${error.message}`);
    }

    return {
      appeals: (rows || []).map(rowToAppeal),
      hasMore: (rows?.length || 0) === limit,
    };
  });

/* List mailings for a user (for dashboard) */
export const listMailings = createServerFn()
  .validator((input: { userId: string; limit?: number }) => input)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServer();
    const limit = data.limit || 50;

    const { data: rows, error } = await supabase
      .from("mailings")
      .select(`
        *,
        appeals!inner (
          id,
          workflow_id,
          status,
          decision
        )
      `)
      .eq("appeals.user_id", data.userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to list mailings: ${error.message}`);
    }

    return {
      mailings: (rows || []).map((row) => ({
        id: row.id,
        appealId: row.appeal_id,
        providerOrderId: row.provider_order_id,
        status: row.status,
        trackingNumber: row.tracking_number,
        mailingMethod: row.mailing_method,
        recipient: row.recipient,
        createdAt: row.created_at,
        workflowId: row.appeals?.workflow_id,
      })),
    };
  });

/* Save a mailing record */
export const saveMailing = createServerFn()
  .validator((input: {
    appealId: string;
    providerOrderId?: string;
    status: string;
    trackingNumber?: string;
    mailingMethod: string;
    recipient: Record<string, unknown>;
    stripeSessionId?: string;
    stripePaymentId?: string;
  }) => input)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServer();
    const { data: result, error } = await supabase
      .from("mailings")
      .insert({
        appeal_id: data.appealId,
        provider_order_id: data.providerOrderId || null,
        status: data.status,
        tracking_number: data.trackingNumber || null,
        mailing_method: data.mailingMethod,
        recipient: data.recipient,
        stripe_session_id: data.stripeSessionId || null,
        stripe_payment_id: data.stripePaymentId || null,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save mailing: ${error.message}`);
    }

    return { id: result.id, saved: true };
  });

/* Delete an appeal */
export const deleteAppeal = createServerFn()
  .validator((input: { id: string }) => input)
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServer();
    const { error } = await supabase
      .from("appeals")
      .delete()
      .eq("id", data.id);

    if (error) {
      throw new Error(`Failed to delete appeal: ${error.message}`);
    }

    return { deleted: true };
  });

/* ── Helpers ── */

function rowToAppeal(row: any): Appeal {
  return {
    id: row.id,
    workflowId: row.workflow_id,
    status: row.status,
    decision: row.decision || {},
    grounds: row.grounds || [],
    evidence: row.evidence || [],
    arguments: row.arguments || [],
    draft: row.draft || "",
    review: row.review || undefined,
    packet: row.packet || undefined,
    proof: row.proof || undefined,
    timeline: row.timeline || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
