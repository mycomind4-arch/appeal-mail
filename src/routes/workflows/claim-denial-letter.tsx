import { createFileRoute } from "@tanstack/react-router";
import { ClaimDenialLetterWorkspace } from "@/components/workflow/claim-denial-letter-workspace";

export const Route = createFileRoute("/workflows/claim-denial-letter")({
  head: () => ({ meta: [
    { title: "Claim Denial Letter — Appeal Mail" },
    { name: "description", content: "Upload a claim denial letter, understand why it was denied, build a documented response, and send it." },
  ] }),
  component: ClaimDenialLetterPage,
});
function ClaimDenialLetterPage() { return <ClaimDenialLetterWorkspace />; }
