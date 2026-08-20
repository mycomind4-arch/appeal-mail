import { Link } from "@tanstack/react-router";
import { CheckCircle2, Clock, ArrowRight, FileText, Search, Lightbulb, FolderOpen, Send, ArrowLeft } from "lucide-react";
import type { AppealWorkflowEntry } from "@/domain/appeal-catalog";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

/* ═══════════════════════════════════════════════════════════
   Appeal Workflow Page — polished placeholder for coming-soon
   workflows, SEO-rich, explaining what the appeal involves.
   ═══════════════════════════════════════════════════════════ */

export function AppealWorkflowPage({ workflow }: { workflow: AppealWorkflowEntry }) {
  const isImplemented = workflow.status === "IMPLEMENTED";

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b border-rule/60 bg-paper-deep/20">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
            <Link to="/workflows" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft size={14} /> Back to workflow directory
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-rule bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {workflow.category}
              </span>
              {isImplemented ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-color-mix-in-oklab-stamp-8-transparent px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp">
                  <CheckCircle2 size={10} /> Available now
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-paper-deep px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <Clock size={10} /> Coming soon
                </span>
              )}
            </div>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">{workflow.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
              {workflow.shortDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {isImplemented ? (
                <Link to="/workflows/denied-claim" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-stamp transition-transform hover:-translate-y-0.5">
                  Start an Appeal <ArrowRight size={16} />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-paper-deep px-6 py-3 text-sm font-medium text-muted-foreground">
                  <Clock size={16} /> Coming soon — join the waitlist
                </span>
              )}
              <Link to="/workflows" className="inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-sm font-medium transition-colors hover:border-ink">
                Explore appeal types
              </Link>
            </div>
          </div>
        </section>

        {/* Long description */}
        <section className="border-b border-rule/60">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="max-w-3xl text-lg leading-8 text-ink-soft">{workflow.longDescription}</p>
          </div>
        </section>

        {/* Info grid */}
        <section className="border-b border-rule/60 bg-paper-deep/25">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="grid gap-6 md:grid-cols-2">
              {/* What we analyze */}
              <div className="rounded-xl border border-rule bg-card p-6">
                <div className="flex items-center gap-2">
                  <Search size={18} className="text-stamp" />
                  <h2 className="font-serif text-xl">What we analyze</h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {workflow.whatWeAnalyze.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stamp" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What you'll need */}
              <div className="rounded-xl border border-rule bg-card p-6">
                <div className="flex items-center gap-2">
                  <FolderOpen size={18} className="text-stamp" />
                  <h2 className="font-serif text-xl">What you'll need</h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {workflow.whatYouNeed.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stamp" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Appeal Mail will identify */}
              <div className="rounded-xl border border-rule bg-card p-6">
                <div className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-stamp" />
                  <h2 className="font-serif text-xl">What Appeal Mail will identify</h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {workflow.whatWeIdentify.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stamp" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What your appeal can address */}
              <div className="rounded-xl border border-rule bg-card p-6">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-stamp" />
                  <h2 className="font-serif text-xl">What your appeal can address</h2>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {workflow.whatAppealAddresses.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-stamp" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Intended user + problem */}
        <section className="border-b border-rule/60">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-stamp">Who this is for</div>
                <p className="mt-2 text-base leading-7 text-ink-soft">{workflow.intendedUser}</p>
              </div>
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-stamp">The problem it solves</div>
                <p className="mt-2 text-base leading-7 text-ink-soft">{workflow.problemSolved}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="border-t border-rule/60 bg-paper-deep/30">
          <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-20">
            {isImplemented ? (
              <>
                <div className="postmark mx-auto w-fit">Ready to start</div>
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl">Start your {workflow.title.toLowerCase()}.</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Upload your denial letter and supporting documents. Appeal Mail will analyze them and help you build a supported appeal.
                </p>
                <Link to="/workflows/denied-claim" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-stamp transition-transform hover:-translate-y-0.5">
                  Start an Appeal <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <div className="postmark mx-auto w-fit">Coming soon</div>
                <h2 className="mt-4 font-serif text-3xl sm:text-4xl">{workflow.title} is on the roadmap.</h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                  We're building this workflow with the same evidence-supported analysis, stress testing, and mailing system that powers Insurance Appeal. Join the waitlist and we'll let you know when it's ready.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link to="/workflows/denied-claim" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-stamp transition-transform hover:-translate-y-0.5">
                    <Send size={16} /> Try Insurance Appeal now
                  </Link>
                  <Link to="/workflows" className="inline-flex items-center gap-2 rounded-full border border-rule px-6 py-3 text-sm font-medium transition-colors hover:border-ink">
                    Browse all appeal types
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
