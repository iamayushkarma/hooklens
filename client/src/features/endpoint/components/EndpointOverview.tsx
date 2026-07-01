import { Copy } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";
import type { Endpoint } from "../types/endpoint.types";
import CopyButton from "@/shared/components/ui/CopyButton";

interface Props {
  endpoint: Endpoint;
}

function EndpointOverview({ endpoint }: Props) {
  const webhookUrl = `${import.meta.env.VITE_WEBHOOK_BASE_URL}/h/${endpoint.slug}`;

  return (
    <div className="rounded-lg border border-border-default p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-text-secondary">Webhook URL</p>

          <code className="mt-1 block text-sm">{webhookUrl}</code>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              endpoint.isActive
                ? "bg-green-500/10 text-green-500"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {endpoint.isActive ? "Active" : "Disabled"}
          </span>

          <span className="text-sm text-text-secondary">
            {endpoint.requestCount} Requests
          </span>

          <CopyButton content={webhookUrl} showLabel />
        </div>
      </div>
    </div>
  );
}

export default EndpointOverview;
