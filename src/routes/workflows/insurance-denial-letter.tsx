import { createFileRoute } from "@tanstack/react-router";
import { InsuranceDenialLetterWorkspace } from "@/components/workflow/insurance-denial-letter-workspace";

export const Route = createFileRoute("/workflows/insurance-denial-letter")({
  head: () => ({ meta: [{ title: "Insurance Denial Letter — Appeal Mail" }, { name: "description", content: "Upload an insurance denial letter, understand the reasons, build a documented response, and prepare it for mailing." }] }),
  component: InsuranceDenialLetterRoute,
});

function InsuranceDenialLetterRoute() {
  return <InsuranceDenialLetterWorkspace />;
}