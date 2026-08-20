import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AppealWorkflowDirectory } from "@/components/appeal-workflow-directory";
import { getCatalogStats, APPEAL_CATALOG } from "@/domain/appeal-catalog";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [
      { title: "Appeal Workflows — Appeal Mail" },
      {
        name: "description",
        content:
          "Browse appeal workflows by type: insurance, disability, unemployment, Medicaid, SNAP, workers' comp, VA, and administrative appeals.",
      },
      { property: "og:title", content: "Appeal Workflows — Appeal Mail" },
      {
        property: "og:description",
        content: "A directory of specialized appeal workflows for denied claims and decisions.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/workflows" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Appeal Mail — Workflow Directory",
          description: "Specialized workflows for appealing denied claims and decisions.",
          url: "/workflows",
          hasPart: APPEAL_CATALOG.map((w) => ({
            "@type": "WebPage",
            name: w.title,
            url: w.route,
            about: w.primaryKeyword,
          })),
        }),
      },
    ],
  }),
  component: WorkflowDirectoryPage,
});

function WorkflowDirectoryPage() {
  const stats = getCatalogStats();

  return (
    <div className="min-h-screen bg-paper">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="border-b border-rule/60">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <div className="postmark w-fit">Appeal Mail</div>
                <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
                  Find the appeal workflow that matches your situation.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
                  Start with the decision, denial, or notice you received. Each workflow is built around a specific appeal type — from insurance claims to disability benefits to workers' compensation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="border-b border-rule/60 bg-paper-deep/25">
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-rule bg-card p-5">
                <div className="font-serif text-3xl text-stamp">{stats.total}</div>
                <div className="mt-1 text-sm font-semibold">appeal workflows</div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Organized by category and search intent.</p>
              </div>
              <div className="rounded-xl border border-rule bg-card p-5">
                <div className="font-serif text-3xl text-stamp">{stats.categories}</div>
                <div className="mt-1 text-sm font-semibold">categories</div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Insurance, disability, unemployment, benefits, and more.</p>
              </div>
              <div className="rounded-xl border border-rule bg-card p-5">
                <div className="font-serif text-3xl text-stamp">{stats.implemented}</div>
                <div className="mt-1 text-sm font-semibold">available now</div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">The rest are on the roadmap and clearly marked.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Directory with search and filter */}
        <AppealWorkflowDirectory />
      </main>
      <SiteFooter />
    </div>
  );
}
