import { Link } from "@tanstack/react-router";
import { Scale } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-warm-border bg-white">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700">
                <Scale size={16} className="text-amber-400" />
              </div>
              <span className="text-base font-bold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>Appeal Mail</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">Prepare and send appeals for denied claims and decisions with confidence.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-indigo-700">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><a href="/#how" className="hover:text-amber-600">How it works</a></li>
              <li><a href="/#workflows" className="hover:text-amber-600">What you can appeal</a></li>
              <li><Link to="/pricing" className="hover:text-amber-600">Pricing</Link></li>
              <li><Link to="/dashboard" className="hover:text-amber-600">My Mailings</Link></li>
              <li><Link to="/faq" className="hover:text-amber-600">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-indigo-700">Resources</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li><Link to="/resources" className="hover:text-amber-600">Guides</Link></li>
              <li><Link to="/about" className="hover:text-amber-600">About</Link></li>
              <li><Link to="/contact" className="hover:text-amber-600">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-amber-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-amber-600">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-indigo-700">Important</h3>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              Appeal Mail is not a law firm and does not provide legal advice. Appeal deadlines can be very short — note yours immediately.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-warm-border pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <span>© 2026 Appeal Mail. Powered by MailMyPDF.</span>
          <span>Information is educational and product-related, not legal advice.</span>
        </div>
      </div>
    </footer>
  );
}
