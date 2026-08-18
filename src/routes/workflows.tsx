import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileText, ShieldCheck, Landmark, Scale, HeartPulse } from "lucide-react";

export const Route = createFileRoute("/workflows")({ component: WorkflowDirectory });

const workflows = [
  { title: "Appeal a Government Decision", description: "Challenge an adverse agency decision with a structured appeal based on the decision, facts, supporting records, and deadline.", icon: Landmark, href: "/workflows/government-decision", intent: "Government appeal" },
  { title: "Request Reconsideration", description: "Prepare a focused reconsideration request when the decision maker offers a review or correction process before a formal appeal.", icon: FileText, href: "/workflows/reconsideration", intent: "Reconsideration" },
  { title: "Appeal a Denied Claim", description: "Organize a denial, policy or program records, supporting evidence, and the points you want the reviewer to reconsider.", icon: ShieldCheck, href: "/workflows/denied-claim", intent: "Denied claim" },
  { title: "Appeal a Court Ruling", description: "Start with the ruling and build a structured record of the decision, grounds for review, and supporting materials.", icon: Scale, href: "/workflows/court-ruling", intent: "Court ruling" },
  { title: "Medical or Benefits Appeal", description: "Use the appeal workspace for health, disability, benefits, and other adverse determinations where supporting records matter.", icon: HeartPulse, href: "/appeal-a-decision", intent: "Benefits / medical" },
];

function WorkflowDirectory() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="eyebrow">Appeal Mail · Workflow directory</div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-teal-800 md:text-6xl" style={{ fontFamily: "var(--font-serif)" }}>
            Find the appeal workflow that matches your situation.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">
            Start with the decision, denial, ruling, or request for reconsideration you received. Each workflow is designed around a distinct appeal job and routes into the working Appeal Mail application.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {workflows.map(({ title, description, icon: Icon, href, intent }) => (
            <Link key={href} to={href} className="card group p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">
                  <Icon size={24} className="text-teal-700" />
                </div>
                <span className="badge badge-green">{intent}</span>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-teal-800" style={{ fontFamily: "var(--font-serif)" }}>{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-rose-600">
                Open workflow <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-warm-border bg-white p-8 md:p-10">
          <div className="eyebrow">Search intent architecture</div>
          <h2 className="mt-3 text-2xl font-bold text-teal-800 md:text-3xl" style={{ fontFamily: "var(--font-serif)" }}>
            Appeal Mail is the master home for appeal and reconsideration workflows.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-slate-500">
            Topic pages, decision types, denial types, and evidence questions should all lead back to the workflow that solves the specific problem. New appeal types belong here before they become a new product or repository.
          </p>
        </section>
      </div>
    </main>
  );
}
