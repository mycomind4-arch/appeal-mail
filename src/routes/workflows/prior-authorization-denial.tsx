import { createFileRoute } from "@tanstack/react-router";
import { PriorAuthorizationDenialWorkspace } from "@/components/workflow/prior-authorization-denial-workspace";
export const Route=createFileRoute("/workflows/prior-authorization-denial")({component:PriorAuthorizationDenialRoute});
function PriorAuthorizationDenialRoute(){return <PriorAuthorizationDenialWorkspace/>;}
