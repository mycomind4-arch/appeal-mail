import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Stamp, Mail, User, LogOut, Shield, ChevronDown, ArrowRight } from "lucide-react";
import { ECOSYSTEM_PRODUCTS, ECOSYSTEM_PAGE_URL } from "./ecosystem-nav";
import { useAuth } from "@/lib/auth";

/* ═══════════════════════════════════════════════════════════
   MailMyPDF Brand Lockup
   ═══════════════════════════════════════════════════════════ */

function MailMyPDFLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-label="MailMyPDF">
      <Mail size={13} className="text-muted-foreground" strokeWidth={2.5} />
      <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {compact ? "MMP" : "MailMyPDF"}
      </span>
    </span>
  );
}

function BrandLockup() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      {/* Appeal Mail icon */}
      <div className="flex h-8 w-8 items-center justify-center rounded-md border border-rule" style={{ background: "var(--ink)" }}>
        <Stamp size={16} className="text-stamp" />
      </div>
      <div className="flex flex-col">
        <span className="font-serif text-lg leading-none transition-colors group-hover:text-stamp">
          Appeal Mail
        </span>
        <span className="mt-0.5"><MailMyPDFLogo compact /></span>
      </div>
    </Link>
  );
}

/* ═══════════════════════════════════════════════════════════
   Ecosystem Workflows Dropdown
   ═══════════════════════════════════════════════════════════ */

function WorkflowsDropdown({ transparent }: { transparent?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1 px-3 py-2 text-sm transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-foreground"}`}
      >
        Workflows
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-[520px] max-w-[calc(100vw-2rem)]">
          <div className="overflow-hidden rounded-xl border border-rule bg-card shadow-premium">
            <div className="border-b border-rule/60 px-5 py-3">
              <div className="font-serif text-base">Workflows</div>
              <p className="mt-0.5 text-xs text-muted-foreground">Purpose-built products for specific document problems.</p>
            </div>
            <div className="grid gap-px bg-rule/20 sm:grid-cols-2">
              {ECOSYSTEM_PRODUCTS.map((p) => (
                <a
                  key={p.product}
                  href={p.href}
                  onClick={() => setOpen(false)}
                  className="block bg-card px-4 py-3 transition-colors hover:bg-muted/40"
                >
                  <div className="font-medium text-sm text-foreground">{p.product}</div>
                  <div className="mt-0.5 text-xs leading-5 text-muted-foreground">{p.description}</div>
                </a>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-rule bg-paper-deep/30 px-5 py-2.5">
              <a href={ECOSYSTEM_PAGE_URL} onClick={() => setOpen(false)} className="text-xs font-medium text-cobalt hover:text-cobalt/80">
                Explore all workflows →
              </a>
              <div className="text-[10px] text-muted-foreground">{ECOSYSTEM_PRODUCTS.length} product families</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Site Header
   ═══════════════════════════════════════════════════════════ */

export function Logo() {
  return <BrandLockup />;
}

export function SiteHeader({ variant = "default" }: { variant?: "default" | "transparent" }) {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const transparent = variant === "transparent";

  const links = [
    { label: "Appeal Types", href: "/workflows" },
    { label: "How it works", href: "/#how" },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/resources" },
    { label: "FAQ", href: "/faq" },
  ];

  const accountLabel = user ? (user.fullName || user.email?.split("@")[0] || "Account") : "Sign in";

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${transparent ? "border-transparent bg-transparent" : "border-rule/60 bg-paper/85 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLockup />

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          <WorkflowsDropdown transparent={transparent} />
          {links.map((item) => (
            <Link key={item.label} to={item.href} className={`px-3 py-2 text-sm transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-foreground"}`}>
              {item.label}
            </Link>
          ))}

          {user ? (
            <>
              {user.role === "admin" || user.role === "super_admin" ? (
                <Link to="/admin" className={`ml-2 inline-flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${transparent ? "text-white/90 hover:text-white" : "text-ink-soft hover:text-foreground"}`}>
                  <Shield size={14} /> Admin
                </Link>
              ) : null}
              <Link to="/dashboard" className={`ml-2 inline-flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${transparent ? "text-white/90 hover:text-white" : "text-ink-soft hover:text-foreground"}`}>
                <User size={14} /> {accountLabel}
              </Link>
              <button
                onClick={() => signOut()}
                className={`ml-1 inline-flex items-center gap-1.5 px-3 py-2 text-sm transition-colors ${transparent ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}
                aria-label="Sign out"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <Link to="/auth" className={`ml-2 px-3 py-2 text-sm transition-colors ${transparent ? "text-white/90 hover:text-white" : "text-ink-soft hover:text-foreground"}`}>
              Sign in
            </Link>
          )}

          <Link to="/workflows/denied-claim" className={`ml-2 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 ${transparent ? "bg-stamp text-accent-foreground shadow-stamp" : "bg-primary text-primary-foreground shadow-stamp"}`}>
            Start an Appeal
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-rule md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? <X size={16} className={transparent ? "text-white" : "text-ink"} /> : <Menu size={16} className={transparent ? "text-white" : "text-ink"} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-rule bg-paper md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            <div className="mb-2">
              <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Workflows</div>
              <div className="grid gap-0.5">
                {ECOSYSTEM_PRODUCTS.map((p) => (
                  <a key={p.product} href={p.href} className="rounded-lg px-3 py-2.5 text-sm text-ink-soft transition-colors hover:bg-muted/50 hover:text-foreground" onClick={() => setOpen(false)}>
                    {p.product}
                  </a>
                ))}
              </div>
            </div>
            {links.map((item) => (
              <Link key={item.label} to={item.href} className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-muted/50 hover:text-foreground" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                {user.role === "admin" || user.role === "super_admin" ? (
                  <Link to="/admin" className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-muted/50 hover:text-foreground" onClick={() => setOpen(false)}>
                    <Shield size={14} className="inline mr-1.5" /> Admin
                  </Link>
                ) : null}
                <Link to="/dashboard" className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-muted/50 hover:text-foreground" onClick={() => setOpen(false)}>
                  <User size={14} className="inline mr-1.5" /> {accountLabel}
                </Link>
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-ink-soft transition-colors hover:bg-muted/50 hover:text-foreground"
                >
                  <LogOut size={14} className="inline mr-1.5" /> Sign out
                </button>
              </>
            ) : (
              <Link to="/auth" className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-muted/50 hover:text-foreground" onClick={() => setOpen(false)}>
                Sign in
              </Link>
            )}
            <Link to="/workflows/denied-claim" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground" onClick={() => setOpen(false)}>Start an Appeal</Link>
          </div>
        </div>
      )}
    </header>
  );
}
