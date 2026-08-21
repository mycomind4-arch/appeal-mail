import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDenialLetterWorkspace } from "@/components/workflow/insurance-denial-letter-workspace";

export const Route = createFileRoute("/workflows/insurance-denial-letter")({
  head: () => ({ meta: [{ title: "Insurance Denial Letter — Appeal Mail" }, { name: "description", content: "Upload an insurance denial letter, understand the reasons, build a documented response, and prepare it for mailing." }, { property: "og:title", content: "Insurance Denial Letter — Appeal Mail — Appeal Mail" }, { property: "og:description", content: "Upload an insurance denial letter, understand the reasons, build a documented response, and prepare it for mailing." }, { name: "twitter:card", content: "summary" }, { name: "twitter:title", content: "Insurance Denial Letter — Appeal Mail — Appeal Mail" }, { name: "twitter:description", content: "Upload an insurance denial letter, understand the reasons, build a documented response, and prepare it for mailing." }], links: [{ rel: "canonical", href: "/workflows/insurance-denial-letter" }] }),
  component: InsuranceDenialLetterRoute,
});

function InsuranceDenialLetterRoute() {
  return <InsuranceDenialLetterWorkspace />;
}