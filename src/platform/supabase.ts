import { createServerFn } from "@tanstack/react-start";

/* ─────────────────────────────────────────────
   Supabase client utilities.
   Server-side client uses service role key.
   ───────────────────────────────────────────── */

export async function getSupabaseServer() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/* Client-side Supabase (for auth, real-time, etc.) */
export async function getSupabaseClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}
