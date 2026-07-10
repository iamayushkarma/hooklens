import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { Outlet, useParams } from "react-router-dom";
import { CopyButton } from "@/shared/components/ui/CopyButton";
import { MoreHorizontal } from "lucide-react";
import Tabs from "@/shared/components/ui/Tabs";

function EndpointLayout() {
  const endpoint = useCurrentEndpoint();

  const { workspaceId, projectId, endpointId } = useParams();

  const webhookUrl = `${import.meta.env.VITE_WEBHOOK_BASE_URL}/h/${endpoint?.slug}`;

  const tabs = [
    {
      label: "Requests",
      path: `/dashboard/workspaces/${workspaceId}/projects/${projectId}/endpoints/${endpointId}`,
    },
    {
      label: "Analytics",
      path: `/dashboard/workspaces/${workspaceId}/projects/${projectId}/endpoints/${endpointId}/analytics`,
    },
    {
      label: "Settings",
      path: `/dashboard/workspaces/${workspaceId}/projects/${projectId}/endpoints/${endpointId}/settings`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            {endpoint?.label}
          </h1>
          <p className="text-sm text-text-secondary">Endpoint Inspector</p>
        </div>

        {/* Endpoint Overview */}
        <div className="rounded-xl border border-border-default bg-bg-card overflow-hidden">
          {/* Top row: status + count + menu */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span
                className={`size-2 rounded-full ${
                  endpoint?.isActive ? "bg-success" : "bg-danger"
                }`}
              />
              <span className="text-sm font-semibold text-text-primary">
                {endpoint?.isActive ? "Active" : "Disabled"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">
                  {endpoint?.requestCount ?? 0}
                </span>{" "}
                requests
              </span>

              <button className="flex size-7 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-bg-sidebar hover:text-text-primary">
                <MoreHorizontal className="size-4" />
              </button>
            </div>
          </div>

          <div className="border-t border-border-default" />

          {/* URL block */}
          <div className="px-5 py-4">
            <p className="mb-2.5 text-sm font-medium text-text-primary">
              Webhook URL
            </p>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-border-default bg-bg-base px-4 py-3">
              <code className="overflow-x-auto whitespace-nowrap font-mono text-sm text-text-secondary">
                http://localhost:8000/h/
                <span className="font-semibold text-text-primary">
                  {endpoint?.slug}
                </span>
              </code>
              <CopyButton content={webhookUrl} />
            </div>
          </div>

          <div className="border-t border-border-default" />

          {/* Client list */}
          <div className="px-5 py-3.5">
            <p className="text-sm text-text-secondary">
              Send requests from Postman, Stripe, GitHub, Zapier, Axios, Fetch,
              or cURL.
            </p>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2">
        <Tabs tabs={tabs} />
      </div>
      <Outlet />
    </div>
  );
}

export default EndpointLayout;
