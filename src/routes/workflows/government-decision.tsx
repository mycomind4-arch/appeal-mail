import { createFileRoute } from "@tanstack/react-router";
import { GovernmentDecisionWorkspace } from "@/components/workflow/government-decision-workspace";
import { GOVERNMENT_DECISION_SEO } from "@/domain/government-decision-seo";

export const Route = createFileRoute("/workflows/government-decision")({
  head: () => ({
    meta: [
      { title: GOVERNMENT_DECISION_SEO.title },
      { name: "description", content: GOVERNMENT_DECISION_SEO.description },
      { name: "keywords", content: GOVERNMENT_DECISION_SEO.relatedKeywords.join(", ") },
      { property: "og:type", content: "website" },
      { property: "og:title", content: GOVERNMENT_DECISION_SEO.title },
      { property: "og:description", content: GOVERNMENT_DECISION_SEO.description },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: GOVERNMENT_DECISION_SEO.title },
      { name: "twitter:description", content: GOVERNMENT_DECISION_SEO.description },
    ],
    links: [{ rel: "canonical", href: GOVERNMENT_DECISION_SEO.canonicalPath }],
  }),
  component: GovernmentDecisionWorkspace,
});
