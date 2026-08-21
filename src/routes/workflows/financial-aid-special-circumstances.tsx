import { createFileRoute } from "@tanstack/react-router";
import { FinancialAidSpecialCircumstancesWorkspace } from "@/components/workflow/financial-aid-special-circumstances-workspace";
import { getWorkflow } from "@/domain/workflows";
export const Route=createFileRoute("/workflows/financial-aid-special-circumstances")({head:()=>({meta:[{title:`${getWorkflow("financial-aid-special-circumstances").title} — Appeal Mail`},{name:"description",content:getWorkflow("financial-aid-special-circumstances").description}]}),component:FinancialAidSpecialCircumstancesWorkspace});
