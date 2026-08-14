import { createFileRoute } from "@tanstack/react-router";
import { WorkflowWizard } from "@/components/workflow/workflow-wizard";

export const Route = createFileRoute("/workflows/denied-claim")({
  head: () => ({
    meta: [
      { title: "Appeal a Denied Claim — Appeal Mail" },
      { name: "description", content: "Guided workflow to prepare and mail an appeal for a denied insurance claim, benefit denial, or workers' compensation decision." },
    ],
  }),
  component: DeniedClaim,
});

function DeniedClaim() {
  return (
    <WorkflowWizard
      workflowId="denied-claim"
      metaTitle="Appeal a Denied Claim — Appeal Mail"
      metaDescription="Guided workflow to prepare and mail an appeal for a denied insurance claim, benefit denial, or workers' compensation decision."
      componentName="DeniedClaim"
    />
  );
}
