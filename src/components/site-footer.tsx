import { Link } from "@tanstack/react-router";
import { Scale } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: "var(--ink)" }}>
                <Scale size={16} className="text-stamp" />
              </div>
              <span className="text-base font-semibold text-ink" style={{ fontFamily: "var(--font-serif)" }}>Appeal Mail</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Prepare and send appeals for denied claims and decisions with confidence.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="/#how" className="hover:text-stamp">How it works</a></li>
              <li><a href="/#workflows" className="hover:text-stamp">What you can appeal</a></li>
              <li><Link to="/pricing" className="hover:text-stamp">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-stamp">My Mailings</Link></li>
              <li><Link to="/faq" className="hover:text-stamp">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Workflows</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/workflows/denied-claim" className="hover:text-stamp">Denied Claim</Link></li>
              <li><Link to="/workflows/government-decision" className="hover:text-stamp">Government Decision</Link></li>
              <li><Link to="/workflows/court-ruling" className="hover:text-stamp">Court Ruling</Link></li>
              <li><Link to="/workflows/reconsideration" className="hover:text-stamp">Reconsideration</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-stamp">About</Link></li>
              <li><Link to="/contact" className="hover:text-stamp">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-stamp">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-stamp">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-rule pt-6">
          <p className="text-xs text-muted-foreground">Appeal Mail is not a law firm and does not provide legal advice. You remain in control of the facts and final document.</p>
        </div>
      </div>
    </footer>
  );
}
