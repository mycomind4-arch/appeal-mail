import { createFileRoute, Link } from "@tanstack/react-router";
import { WorkflowWizard } from "@/components/workflow/workflow-wizard";
import { workflows } from "@/domain/workflows";
import { constructWorkflow } from "@/domain/workflow-capabilities";
import { evaluateGoldStandardGate } from "@/domain/gold-standard-gate";
import "@/domain/insurance-packs";

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
  const constructed = constructWorkflow(workflows["denied-claim"]);
  const gate = evaluateGoldStandardGate(constructed);

  if (!gate.passed) {
    return (
      <main className="min-h-screen bg-paper px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-xl border border-amber-200 bg-amber-50 p-8">
          <h1 className="text-2xl font-semibold text-amber-900">This workflow is temporarily unavailable</h1>
          <p className="mt-3 text-sm text-amber-800">The production execution gate is not satisfied, so the system will not present a false-ready workflow.</p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-amber-800">
            {gate.blockingReasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <Link to="/workflows/denied-claim-ai" className="inline-flex rounded-full border border-ink px-4 py-2 text-xs font-semibold">Open multi-LLM AI review →</Link>
      </div>
      <WorkflowWizard
        workflowId="denied-claim"
        metaTitle="Appeal a Denied Claim — Appeal Mail"
        metaDescription="Guided workflow to prepare and mail an appeal for a denied insurance claim, benefit denial, or workers' compensation decision."
        componentName="DeniedClaim"
      />
    </main>
  );
}
