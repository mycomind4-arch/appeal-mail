import { Link } from "@tanstack/react-router";
import { Scale, Mail } from "lucide-react";
import { workflows } from "@/domain/workflows";

/* ═══════════════════════════════════════════════════════════
   MailMyPDF Ecosystem Footer
   ═══════════════════════════════════════════════════════════

   Reinforces the MailMyPDF parent brand and ecosystem.
   Only links products and routes that actually exist.
   ═══════════════════════════════════════════════════════════ */

export function SiteFooter() {
  const workflowCount = Object.keys(workflows).length;

  return (
    <footer className="border-t border-rule bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--ink)" }}>
                <Scale size={16} className="text-stamp" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-ink" style={{ fontFamily: "var(--font-serif)" }}>Appeal Mail</span>
                <span className="inline-flex items-center gap-1 mt-0.5">
                  <Mail size={11} className="text-muted-foreground" strokeWidth={2.5} />
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">MailMyPDF</span>
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Understand adverse decisions, organize evidence, build supported appeals, and send with proof of delivery.
            </p>
          </div>

          {/* Products column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">MailMyPDF Products</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><span className="font-medium text-foreground">Appeal Mail</span> <span className="text-muted-foreground/60">(this product)</span></li>
              <li className="text-muted-foreground/50">Notice Respond <span className="text-[10px]">coming soon</span></li>
              <li className="text-muted-foreground/50">Immigration Mail <span className="text-[10px]">coming soon</span></li>
              <li className="text-muted-foreground/50">Dispute Mail <span className="text-[10px]">coming soon</span></li>
              <li className="text-muted-foreground/50">Small Business Mail <span className="text-[10px]">coming soon</span></li>
            </ul>
          </div>

          {/* Account column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-stamp transition-colors">Dashboard</Link></li>
              <li><Link to="/dashboard" className="hover:text-stamp transition-colors">My Cases</Link></li>
              <li><Link to="/dashboard" className="hover:text-stamp transition-colors">Mailings</Link></li>
              <li><Link to="/account" className="hover:text-stamp transition-colors">Settings</Link></li>
              <li><Link to="/auth" className="hover:text-stamp transition-colors">Sign in / Create account</Link></li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/workflows" className="hover:text-stamp transition-colors">All Appeal Types ({workflowCount})</Link></li>
              <li><Link to="/about" className="hover:text-stamp transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-stamp transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-stamp transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-stamp transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        {/* Legal disclaimer */}
        <div className="mt-10 border-t border-rule pt-6">
          <p className="text-xs text-muted-foreground">
            Appeal Mail is not a law firm and does not provide legal advice. You remain in control of the facts and final document.
            Mailing fulfillment provided by{" "}
            <span className="font-medium text-foreground">MailMyPDF</span>.
          </p>
          <p className="mt-2 text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} MailMyPDF, Inc. Appeal Mail is a MailMyPDF product.
          </p>
        </div>
      </div>
    </footer>
  );
}
