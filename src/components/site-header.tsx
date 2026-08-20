import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Scale } from "lucide-react";

export function SiteHeader({ variant = "default" }: { variant?: "default" | "transparent" }) {
  const [open, setOpen] = useState(false);
  const transparent = variant === "transparent";

  const links = [
    { label: "Workflows", href: "/workflows" },
    { label: "How it works", href: "/#how" },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/resources" },
    { label: "FAQ", href: "/faq" },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-all ${transparent ? "border-transparent bg-transparent" : "border-rule bg-card/95 backdrop-blur-sm"}`}>
      <div className="container flex min-h-14 items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-md ${transparent ? "border border-white/20" : "border border-rule"}`} style={{ background: "var(--ink)" }}>
            <Scale size={16} className="text-stamp" />
          </div>
          <span className={`text-base font-semibold tracking-tight ${transparent ? "text-white" : "text-ink"}`} style={{ fontFamily: "var(--font-serif)" }}>
            Appeal Mail
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((item) => (
            <Link to={item.href} key={item.label} className={`text-sm font-medium transition-colors ${transparent ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/dashboard" className={`text-sm font-semibold ${transparent ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-foreground"}`}>My Mailings</Link>
          <Link to="/workflows/denied-claim" className="btn-amber btn-sm">Start</Link>
        </div>

        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X size={20} className={transparent ? "text-white" : "text-ink"} /> : <Menu size={20} className={transparent ? "text-white" : "text-ink"} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-rule bg-card md:hidden">
          <nav className="container flex flex-col gap-1 py-4">
            {links.map((item) => (
              <Link to={item.href} key={item.label} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-paper-deep hover:text-foreground" onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link to="/dashboard" className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-paper-deep hover:text-foreground" onClick={() => setOpen(false)}>My Mailings</Link>
            <Link to="/workflows/denied-claim" className="btn-amber btn-sm mt-2" onClick={() => setOpen(false)}>Start an appeal</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
