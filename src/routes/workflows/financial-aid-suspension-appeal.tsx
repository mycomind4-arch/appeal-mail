import { createFileRoute } from "@tanstack/react-router";
import { FinancialAidSuspensionAppealWorkspace } from "@/components/workflow/financial-aid-suspension-appeal-workspace";
import { getWorkflow } from "@/domain/workflows";
export const Route=createFileRoute("/workflows/financial-aid-suspension-appeal")({head:()=>({meta:[{title:`${getWorkflow("financial-aid-suspension-appeal").title} — Appeal Mail`},{name:"description",content:getWorkflow("financial-aid-suspension-appeal").description}]}),component:FinancialAidSuspensionAppealWorkspace});
