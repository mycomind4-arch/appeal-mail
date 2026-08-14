import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { PackageCheck, Clock, CheckCircle2, FileText, TrendingUp, Mail, ArrowRight, Search, AlertCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { listMailings } from "@/platform/appeal-repository";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [
    { title: "My Mailings — Appeal Mail" },
    { name: "description", content: "View your mailing history, tracking status, and delivery records." },
    { name: "robots", content: "noindex,nofollow" },
  ] }),
  component: DashboardPage,
});

const statusConfig: Record<string, { label: string; badge: string }> = {
  paid: { label: "Paid", badge: "badge badge-indigo" },
  submitted: { label: "Submitted", badge: "badge badge-indigo" },
  in_transit: { label: "In transit", badge: "badge badge-amber" },
  mailed: { label: "Mailed", badge: "badge badge-amber" },
  delivered: { label: "Delivered", badge: "badge badge-green" },
  failed: { label: "Failed", badge: "badge badge-amber" },
  draft: { label: "Draft", badge: "badge badge-indigo" },
};

function DashboardPage() {
  const [mailings, setMailings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMailings() {
      try {
        setLoading(true);
        // In production, userId comes from Supabase auth session
        // For now, try to load — if Supabase isn't configured, show empty state
        const result = await listMailings({ data: { userId: "demo-user", limit: 50 } });
        setMailings(result.mailings);
      } catch (err) {
        setError("Could not load mailings. Database may not be configured yet.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMailings();
  }, []);

  // Compute stats from real data
  const total = mailings.length;
  const inTransit = mailings.filter((m) => m.status === "in_transit" || m.status === "mailed").length;
  const delivered = mailings.filter((m) => m.status === "delivered").length;

  const stats = [
    { label: "Total mailings", value: String(total), icon: Mail, color: "text-indigo-700" },
    { label: "In transit", value: String(inTransit), icon: PackageCheck, color: "text-amber-500" },
    { label: "Delivered", value: String(delivered), icon: CheckCircle2, color: "text-amber-600" },
    { label: "Draft appeals", value: String(mailings.filter((m) => m.status === "draft").length), icon: FileText, color: "text-slate-400" },
  ];

  return (
    <main className="min-h-screen bg-cream"><SiteHeader />
      <section className="bg-white py-10 border-b border-warm-border"><div className="container">
        <div className="flex items-center justify-between flex-wrap gap-3"><div><h1 className="text-2xl font-bold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>My Mailings</h1><p className="mt-1 text-sm text-slate-400">Track your appeals and delivery records.</p></div>
        <Link to="/workflows/denied-claim" className="btn-amber">New mailing <ArrowRight size={16} /></Link></div>
      </div></section>
      <section className="py-8"><div className="container">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{stats.map(({ label, value, icon: Icon, color }) => (<div key={label} className="card p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">{label}</p><p className="mt-1 text-2xl font-bold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>{value}</p></div><Icon size={24} className={color} /></div></div>))}</div>

        {/* Error state */}
        {error && (
          <div className="mt-8 alert alert-warning">
            <AlertCircle size={18} className="inline mr-2" /> {error}
            <div className="mt-2 text-xs text-slate-500">
              To enable persistence, set up Supabase using <code className="font-mono">supabase/schema.sql</code> and add environment variables.
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="mt-8 card p-12 text-center">
            <div className="animate-pulse text-slate-400">Loading your mailings…</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && mailings.length === 0 && (
          <div className="mt-8 card p-12 text-center">
            <Mail size={32} className="mx-auto text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-indigo-700" style={{ fontFamily: "var(--font-serif)" }}>No mailings yet</h2>
            <p className="mt-2 text-sm text-slate-400">Start your first appeal to see it here.</p>
            <Link to="/workflows/denied-claim" className="btn-amber mt-4">Start an appeal <ArrowRight size={16} /></Link>
          </div>
        )}

        {/* Mailings table */}
        {!loading && !error && mailings.length > 0 && (
          <div className="mt-8 card overflow-hidden">
            <div className="flex items-center justify-between border-b border-warm-border px-5 py-4"><h2 className="font-semibold text-indigo-700">Recent mailings</h2><div className="relative"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" /><input className="input-field pl-9 py-2 text-sm" placeholder="Search mailings..." style={{ width: 200 }} /></div></div>
            <div className="hidden md:block"><table className="w-full text-sm"><thead className="bg-indigo-50 text-left text-xs font-semibold text-indigo-500"><tr><th className="px-5 py-3">Reference</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Recipient</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Mail type</th><th className="px-5 py-3">Status</th></tr></thead>
              <tbody className="divide-y divide-warm-border">{mailings.map((m) => (<tr key={m.id} className="hover:bg-cream transition-colors cursor-pointer"><td className="px-5 py-3.5 font-mono text-xs font-semibold text-indigo-700">{m.id.slice(0, 12)}</td><td className="px-5 py-3.5 text-slate-500">{m.workflowId || "—"}</td><td className="px-5 py-3.5 text-slate-500">{m.recipient?.name || "—"}</td><td className="px-5 py-3.5 text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</td><td className="px-5 py-3.5 text-slate-400 capitalize">{m.mailingMethod || "—"}</td><td className="px-5 py-3.5"><span className={(statusConfig[m.status] || statusConfig.draft).badge}>{(statusConfig[m.status] || statusConfig.draft).label}</span></td></tr>))}</tbody>
            </table></div>
            <div className="divide-y divide-warm-border md:hidden">{mailings.map((m) => (<div key={m.id} className="p-4"><div className="flex items-center justify-between"><span className="font-mono text-xs font-semibold text-indigo-700">{m.id.slice(0, 12)}</span><span className={(statusConfig[m.status] || statusConfig.draft).badge}>{(statusConfig[m.status] || statusConfig.draft).label}</span></div><p className="mt-2 font-semibold text-indigo-700">{m.workflowId}</p><p className="mt-1 text-sm text-slate-400">{m.recipient?.name}</p><div className="mt-2 flex items-center gap-3 text-xs text-slate-300"><span>{new Date(m.createdAt).toLocaleDateString()}</span><span>·</span><span className="capitalize">{m.mailingMethod}</span></div></div>))}</div>
          </div>
        )}
      </div></section>
      <SiteFooter />
    </main>
  );
}
