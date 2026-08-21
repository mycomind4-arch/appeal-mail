import { createFileRoute } from "@tanstack/react-router";
import { LicenseRevocationAppealWorkspace } from "@/components/workflow/license-revocation-appeal-workspace";
import { getWorkflow } from "@/domain/workflows";
export const Route = createFileRoute("/workflows/license-revocation-appeal")({ head: () => ({ meta: [{ title: `${getWorkflow("license-revocation-appeal").title} — Appeal Mail` }, { name: "description", content: getWorkflow("license-revocation-appeal").description }] }), component: LicenseRevocationAppealWorkspace });
