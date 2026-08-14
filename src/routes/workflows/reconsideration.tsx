import { createFileRoute } from "@tanstack/react-router";
import { WorkflowWizard } from "@/components/workflow/workflow-wizard";

export const Route = createFileRoute("/workflows/reconsideration")({
  head: () => ({
    meta: [
      { title: "Submit a Reconsideration Request — Appeal Mail" },
      { name: "description", content: "Request an internal review or reconsideration before filing a formal appeal." },
    ],
  }),
  component: Reconsideration,
});

function Reconsideration() {
  return (
    <WorkflowWizard
      workflowId="reconsideration"
      metaTitle="Submit a Reconsideration Request — Appeal Mail"
      metaDescription="Request an internal review or reconsideration before filing a formal appeal."
      componentName="Reconsideration"
    />
  );
}
