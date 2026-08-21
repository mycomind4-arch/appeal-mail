import { createFileRoute } from "@tanstack/react-router";
import { ReconsiderationWorkspace } from "@/components/workflow/reconsideration-workspace";
import { getWorkflow } from "@/domain/workflows";
export const Route = createFileRoute("/workflows/reconsideration")({head:()=>({meta:[{title:`${getWorkflow("reconsideration").title} — Appeal Mail`},{name:"description",content:getWorkflow("reconsideration").description}]}),component:ReconsiderationWorkspace});
