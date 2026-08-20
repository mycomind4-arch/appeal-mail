import { Link } from "@tanstack/react-router";
import { Scale } from "lucide-react";
import { CATEGORY_ORDER, getWorkflowsByCategory, getCatalogStats } from "@/domain/appeal-catalog";

export function SiteFooter() {
  const stats = getCatalogStats();

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
            <p className="mt-3 text-sm leading-6 text-muted-foreground">Analyze decisions, organize evidence, build a supported appeal, and send it with proof of delivery.</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/workflows/denied-claim" className="hover:text-stamp transition-colors">Start an Appeal</Link></li>
              <li><Link to="/workflows" className="hover:text-stamp transition-colors">All Appeal Types ({stats.total})</Link></li>
              <li><Link to="/#how" className="hover:text-stamp transition-colors">How it works</Link></li>
              <li><Link to="/pricing" className="hover:text-stamp transition-colors">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-stamp transition-colors">My Mailings</Link></li>
              <li><Link to="/faq" className="hover:text-stamp transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Appeal Categories</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {CATEGORY_ORDER.map((cat) => {
                const count = getWorkflowsByCategory(cat).length;
                return (
                  <li key={cat}>
                    <Link to="/workflows" className="hover:text-stamp transition-colors">
                      {cat} ({count})
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-stamp transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-stamp transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-stamp transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-stamp transition-colors">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-rule pt-6">
          <p className="text-xs text-muted-foreground">
            Appeal Mail is not a law firm and does not provide legal advice. You remain in control of the facts and final document.
            Mailing fulfillment provided by MailMyPDF.
          </p>
        </div>
      </div>
    </footer>
  );
}
