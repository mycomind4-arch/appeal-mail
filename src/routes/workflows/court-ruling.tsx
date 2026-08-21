import { createFileRoute } from "@tanstack/react-router";
import { CourtRulingWorkspace } from "@/components/workflow/court-ruling-workspace";
import { getWorkflow } from "@/domain/workflows";
export const Route=createFileRoute("/workflows/court-ruling")({head:()=>({meta:[{title:`${getWorkflow("court-ruling").title} — Appeal Mail`},{name:"description",content:getWorkflow("court-ruling").description}]}),component:CourtRulingWorkspace});
