/* ═══════════════════════════════════════════════════════════
   SSO Propagation — Cross-domain session syncing
   ═══════════════════════════════════════════════════════════

   After a user logs in on any vertical, we propagate the Supabase
   session to all other MailMyPDF product domains using hidden iframes.

   Each iframe points to the target domain's /auth/sso-callback route
   with tokens in the URL hash. The callback calls supabase.auth.setSession()
   to establish a local session in that domain's localStorage.

   This is the standard "silent SSO" pattern — no redirects, no popups.
   The user stays on the current page while sessions are set across all
   products in the background.
   ═══════════════════════════════════════════════════════════ */

const HUB_URL = "https://mailmypdf-etc.pages.dev";

// All vertical domains in the ecosystem
const ALL_DOMAINS = [
  "https://mailmypdf-etc.pages.dev",
  "https://appeal-mail.pages.dev",
  "https://insurance-claims.pages.dev",
  "https://benefits-appeal.pages.dev",
  "https://debt-defense.pages.dev",
  "https://notice-respond.pages.dev",
  "https://dispute-mail.pages.dev",
  "https://immigration-mail.pages.dev",
  "https://govreply.pages.dev",
  "https://code-enforcement.pages.dev",
  "https://mycomind4-arch-mailmypdf-smallbusiness.pages.dev",
  "https://mycomind4-arch-mailmypdf-private-office.pages.dev",
];

/**
 * Propagate a Supabase session to all other MailMyPDF domains.
 * Called after successful login on any vertical.
 *
 * @param accessToken - Supabase access token
 * @param refreshToken - Supabase refresh token
 * @param expiresIn - Session expiry in seconds
 */
export function propagateSSOSession(
  accessToken: string,
  refreshToken: string,
  expiresIn: number,
): void {
  if (typeof window === "undefined") return;

  const currentOrigin = window.location.origin;
  const otherDomains = ALL_DOMAINS.filter(d => d !== currentOrigin);

  for (const domain of otherDomains) {
    const url = new URL("/auth/sso-callback", domain);
    url.hash = new URLSearchParams({
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: String(expiresIn),
    }).toString();

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.position = "absolute";
    iframe.src = url.toString();
    iframe.setAttribute("aria-hidden", "true");

    // Remove iframe after it loads (callback has run by then)
    iframe.addEventListener("load", () => {
      // Give the callback a moment to execute, then clean up
      setTimeout(() => {
        iframe.remove();
      }, 1000);
    });

    // Safety timeout — remove after 5s even if load doesn't fire
    setTimeout(() => {
      if (iframe.parentNode) iframe.remove();
    }, 5000);

    document.body.appendChild(iframe);
  }
}

/**
 * Check if the hub has a session by loading a hidden iframe to the hub's
 * SSO relay. If the hub has a session, it will redirect the iframe to
 * this domain's callback with tokens.
 *
 * This is used when a user visits a vertical's auth page without a local
 * session — we check the hub before showing the login form.
 */
export function checkHubForSession(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    const currentOrigin = window.location.origin;
    const relayUrl = new URL("/auth/sso-silent", HUB_URL);
    relayUrl.searchParams.set("origin", currentOrigin);

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.position = "absolute";
    iframe.src = relayUrl.toString();
    iframe.setAttribute("aria-hidden", "true");

    let resolved = false;

    // Listen for postMessage from the iframe
    const handler = (event: MessageEvent) => {
      if (event.origin !== HUB_URL && event.origin !== currentOrigin) return;
      if (event.data?.type === "sso-session") {
        resolved = true;
        window.removeEventListener("message", handler);
        iframe.remove();
        resolve(event.data.hasSession === true);
      }
    };
    window.addEventListener("message", handler);

    // If the iframe loads but we get no postMessage within 3s, assume no session
    iframe.addEventListener("load", () => {
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          window.removeEventListener("message", handler);
          if (iframe.parentNode) iframe.remove();
          resolve(false);
        }
      }, 2000);
    });

    // Safety timeout
    setTimeout(() => {
      if (!resolved) {
        resolved = true;
        window.removeEventListener("message", handler);
        if (iframe.parentNode) iframe.remove();
        resolve(false);
      }
    }, 5000);

    document.body.appendChild(iframe);
  });
}

/**
 * Redirect to the hub for full SSO (when silent check finds no session).
 * The hub will show its login page and redirect back after auth.
 */
export function redirectToHubSSO(returnTo?: string): void {
  if (typeof window === "undefined") return;

  const returnUrl = returnTo || window.location.origin + window.location.pathname;
  const ssoUrl = new URL("/auth/sso", HUB_URL);
  ssoUrl.searchParams.set("return_to", returnUrl);

  window.location.href = ssoUrl.toString();
}
