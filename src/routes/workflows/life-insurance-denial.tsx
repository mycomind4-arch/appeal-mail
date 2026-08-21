import { createFileRoute } from "@tanstack/react-router";
import { LifeInsuranceDenialWorkspace } from "@/components/workflow/life-insurance-denial-workspace";
export const Route = createFileRoute("/workflows/life-insurance-denial")({ component: LifeInsuranceDenialWorkspace });
