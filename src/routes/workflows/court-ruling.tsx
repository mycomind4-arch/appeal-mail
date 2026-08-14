import { createFileRoute } from "@tanstack/react-router";
import { WorkflowWizard } from "@/components/workflow/workflow-wizard";

export const Route = createFileRoute("/workflows/court-ruling")({
  head: () => ({
    meta: [
      { title: "Appeal a Court Ruling — Appeal Mail" },
      { name: "description", content: "Prepare an appeal for a small claims, traffic, or municipal court decision." },
    ],
  }),
  component: CourtRuling,
});

function CourtRuling() {
  return (
    <WorkflowWizard
      workflowId="court-ruling"
      metaTitle="Appeal a Court Ruling — Appeal Mail"
      metaDescription="Prepare an appeal for a small claims, traffic, or municipal court decision."
      componentName="CourtRuling"
    />
  );
}
