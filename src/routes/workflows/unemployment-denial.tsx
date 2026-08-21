import { createFileRoute } from "@tanstack/react-router";
import { UnemploymentDenialWorkspace } from "@/components/workflow/unemployment-denial-workspace";

export const Route = createFileRoute("/workflows/unemployment-denial")({
  head: () => ({ meta: [
    { title: "Appeal an Unemployment Denial — Appeal Mail" },
    { name: "description", content: "Upload an unemployment decision, understand the findings, build a response, and prepare it for mailing." },
  ] }),
  component: () => <UnemploymentDenialWorkspace />,
});
