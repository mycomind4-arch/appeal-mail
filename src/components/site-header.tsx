import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Scale } from "lucide-react";

export function Logo() {
  return (
    <span aria-hidden className="relative inline-flex h-8 w-10 items-center justify-center rounded-sm border border-ink bg-paper-deep overflow-hidden">
      <svg className="h-4 w-4 text-stamp" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 8h18M5 5h14v14H5z" /></svg>
    </span>
  );
}

export function SiteHeader({ variant = "default" }: { variant?: "default" | "transparent" }) {
  const [open, setOpen] = useState(false);
  const transparent = variant === "transparent";

  const links = [
    { label: "Appeal Types", href: "/workflows" },
    { label: "How it works", href: "/#how" },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/resources" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${transparent ? "border-transparent bg-transparent" : "border-rule/60 bg-paper/85 backdrop-blur-md"}`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${transparent ? "border border-white/20" : "border border-rule"}`} style={{ background: "var(--ink)" }}>
            <Scale size={16} className="text-stamp" />
          </div>
          <span className={`font-serif text-lg leading-none transition-colors ${transparent ? "text-white group-hover:text-stamp-soft" : "group-hover:text-stamp"}`}>
            Appeal Mail
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <Link key={item.label} to={item.href} className={`px-3 py-2 text-sm transition-colors ${transparent ? "text-white/80 hover:text-white" : "text-ink-soft hover:text-foreground"}`}>
              {item.label}
            </Link>
          ))}
          <Link to="/dashboard" className={`ml-2 px-3 py-2 text-sm transition-colors ${transparent ? "text-white/90 hover:text-white" : "text-ink-soft hover:text-foreground"}`}>
            My Mailings
          </Link>
          <Link to="/workflows/denied-claim" className={`ml-2 inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 ${transparent ? "bg-stamp text-accent-foreground shadow-stamp" : "bg-primary text-primary-foreground shadow-stamp"}`}>
            Start an Appeal
          </Link>
        </div>

        <button className="flex h-9 w-9 items-center justify-center rounded-md border border-rule md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? (
            <X size={16} className={transparent ? "text-white" : "text-ink"} />
          ) : (
            <Menu size={16} className={transparent ? "text-white" : "text-ink"} />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-rule bg-paper md:hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {links.map((item) => (
              <Link key={item.label} to={item.href} className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-muted/50 hover:text-foreground" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link to="/dashboard" className="rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-muted/50 hover:text-foreground" onClick={() => setOpen(false)}>My Mailings</Link>
            <Link to="/workflows/denied-claim" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground" onClick={() => setOpen(false)}>Start an Appeal</Link>
          </div>
        </div>
      )}
    </header>
  );
}
