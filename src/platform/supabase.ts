import { createServerFn } from "@tanstack/react-start";

/* ─────────────────────────────────────────────
   Supabase client utilities.
   Server-side client uses service role key.
   Client-side client fetches config from /api/auth/config
   so Cloudflare Pages runtime secrets work without
   build-time environment variables.
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

/* Runtime config cache for client-side use */
let _clientConfig: { url: string; anonKey: string } | null | undefined;

async function fetchClientConfig(): Promise<{ url: string; anonKey: string } | null> {
  if (_clientConfig !== undefined) return _clientConfig;

  // Try import.meta.env first (works in dev and if build-time vars are set)
  const envUrl = (import.meta as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL;
  const envKey = (import.meta as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey) {
    _clientConfig = { url: envUrl, anonKey: envKey };
    return _clientConfig;
  }

  // Fall back to runtime config endpoint (works with Cloudflare Pages secrets)
  try {
    const res = await fetch("/api/auth/config");
    if (!res.ok) { _clientConfig = null; return null; }
    const data = await res.json() as { configured: boolean; url: string | null; anonKey: string | null };
    if (data.configured && data.url && data.anonKey) {
      _clientConfig = { url: data.url, anonKey: data.anonKey };
      return _clientConfig;
    }
  } catch {
    // network or parse error
  }

  _clientConfig = null;
  return null;
}

/* Client-side Supabase (for auth, real-time, etc.) */
export async function getSupabaseClient() {
  const config = await fetchClientConfig();
  if (!config) return null;

  const { createClient } = await import("@supabase/supabase-js");
  return createClient(config.url, config.anonKey);
}

/**
 * Resolve the authenticated Supabase user from a bearer token supplied by the
 * browser. The token is verified server-side; callers never submit a trusted
 * userId field.
 */
export async function requireAuthenticatedUser(request: Request) {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new Error("Authentication required");

  const supabase = await getSupabaseServer();
  const { data, error } = await supabase.auth.getUser(match[1]);
  if (error || !data.user) throw new Error("Invalid or expired authentication token");

  return data.user;
}
