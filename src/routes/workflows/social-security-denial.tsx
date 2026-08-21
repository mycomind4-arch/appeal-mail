import { createFileRoute } from "@tanstack/react-router";
import { SocialSecurityDenialWorkspace } from "@/components/workflow/social-security-denial-workspace";
import { getWorkflow } from "@/domain/workflows";

export const Route = createFileRoute("/workflows/social-security-denial")({
  head: () => ({ meta: [{ title: "Appeal a Social Security Denial — Appeal Mail" }, { name: "description", content: getWorkflow("social-security-denial").description }] }),
  component: () => <SocialSecurityDenialWorkspace />,
});
