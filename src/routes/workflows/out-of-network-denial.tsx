import { createFileRoute } from "@tanstack/react-router";
import { OutOfNetworkDenialWorkspace } from "@/components/workflow/out-of-network-denial-workspace";
export const Route = createFileRoute("/workflows/out-of-network-denial")({ component: OutOfNetworkDenialWorkspace });
