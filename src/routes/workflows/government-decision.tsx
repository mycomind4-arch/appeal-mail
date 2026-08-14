import { createFileRoute } from "@tanstack/react-router";
import { WorkflowWizard } from "@/components/workflow/workflow-wizard";

export const Route = createFileRoute("/workflows/government-decision")({
  head: () => ({
    meta: [
      { title: "Appeal a Government Decision — Appeal Mail" },
      { name: "description", content: "Prepare an appeal for a denied government benefit, licensing decision, or agency ruling." },
    ],
  }),
  component: GovernmentDecision,
});

function GovernmentDecision() {
  return (
    <WorkflowWizard
      workflowId="government-decision"
      metaTitle="Appeal a Government Decision — Appeal Mail"
      metaDescription="Prepare an appeal for a denied government benefit, licensing decision, or agency ruling."
      componentName="GovernmentDecision"
    />
  );
}
