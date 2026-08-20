import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import {
  APPEAL_CATALOG,
  CATEGORY_ORDER,
  CATEGORY_DESCRIPTIONS,
  type AppealWorkflowEntry,
  type AppealCategory,
  type WorkflowStatus,
  searchWorkflows,
  getCatalogStats,
} from "@/domain/appeal-catalog";

/* ═══════════════════════════════════════════════════════════
   Workflow Directory — catalog with search and filter
   ═══════════════════════════════════════════════════════════ */

export function AppealWorkflowDirectory() {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "ALL">("ALL");
  const [categoryFilter, setCategoryFilter] = useState<AppealCategory | "ALL">("ALL");

  const stats = getCatalogStats();

  const filtered = useMemo(() => {
    let results = searchWorkflows(query);
    if (statusFilter !== "ALL") {
      results = results.filter((w) => w.status === statusFilter);
    }
    if (categoryFilter !== "ALL") {
      results = results.filter((w) => w.category === categoryFilter);
    }
    return results;
  }, [query, statusFilter, categoryFilter]);

  const grouped = useMemo(() => {
    const groups = new Map<AppealCategory, AppealWorkflowEntry[]>();
    for (const cat of CATEGORY_ORDER) {
      const items = filtered.filter((w) => w.category === cat);
      if (items.length > 0) groups.set(cat, items);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  return (
    <div>
      {/* Search and filter bar */}
      <div className="sticky top-14 z-30 border-b border-rule/60 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search appeal types — try 'insurance', 'SSI', 'unemployment'…"
                className="w-full rounded-full border border-rule bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-ink/10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as AppealCategory | "ALL")}
                className="rounded-full border border-rule bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-ink"
              >
                <option value="ALL">All categories</option>
                {CATEGORY_ORDER.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | "ALL")}
                className="rounded-full border border-rule bg-card px-4 py-2.5 text-sm outline-none transition-colors focus:border-ink"
              >
                <option value="ALL">All statuses</option>
                <option value="IMPLEMENTED">Available now</option>
                <option value="COMING_SOON">Coming soon</option>
              </select>
            </div>
          </div>
          <div className="mt-3 flex gap-4 font-mono text-xs text-muted-foreground">
            <span>{filtered.length} workflows</span>
            <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-stamp" /> {stats.implemented} available</span>
            <span className="flex items-center gap-1"><Clock size={12} className="text-ink-soft" /> {stats.comingSoon} coming soon</span>
          </div>
        </div>
      </div>

      {/* Category groups */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {grouped.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif text-2xl text-ink">No workflows match your search.</p>
            <p className="mt-2 text-sm text-muted-foreground">Try a different term or clear your filters.</p>
            <button
              onClick={() => { setQuery(""); setStatusFilter("ALL"); setCategoryFilter("ALL"); }}
              className="mt-6 rounded-full border border-rule px-5 py-2.5 text-sm font-medium transition-colors hover:border-ink hover:bg-paper-deep"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {grouped.map(([category, workflows]) => (
              <section key={category}>
                <div className="mb-5 flex items-center gap-3">
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{category}</h3>
                  <span className="h-px flex-1 bg-rule/60" />
                  <span className="font-mono text-xs text-muted-foreground">{workflows.length}</span>
                </div>
                <p className="mb-6 max-w-2xl text-sm leading-6 text-muted-foreground">{CATEGORY_DESCRIPTIONS[category]}</p>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {workflows.map((workflow) => (
                    <WorkflowCard key={workflow.slug} workflow={workflow} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkflowCard({ workflow }: { workflow: AppealWorkflowEntry }) {
  const isAvailable = workflow.status === "IMPLEMENTED";

  return (
    <Link
      to={workflow.route}
      className="group flex h-full flex-col rounded-xl border border-rule bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-ink/30 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full border border-rule bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {workflow.category}
        </span>
        {isAvailable ? (
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-stamp" style={{ background: "color-mix(in oklab, var(--stamp) 8%, transparent)" }}>
            <CheckCircle2 size={10} /> Available
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-paper-deep px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Clock size={10} /> Coming soon
          </span>
        )}
      </div>
      <h3 className="mt-4 font-serif text-2xl leading-tight">{workflow.title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{workflow.shortDescription}</p>
      <div className="mt-4 border-t border-rule/60 pt-4">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Search intent</div>
        <div className="mt-1 text-sm font-medium text-foreground">{workflow.primaryKeyword}</div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-stamp">{workflow.cta}</span>
        <span className="text-muted-foreground transition-transform group-hover:translate-x-1">→</span>
      </div>
    </Link>
  );
}
