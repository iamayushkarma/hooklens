import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { Outlet, NavLink, useParams } from "react-router-dom";
import { CopyButton } from "@/shared/components/ui/CopyButton";

function EndpointLayout() {
  const endpoint = useCurrentEndpoint();

  const { workspaceId, projectId, endpointId } = useParams();

  const webhookUrl = `${import.meta.env.VITE_WEBHOOK_BASE_URL}/h/${endpoint?.slug}`;
  console.log("webhookUrl: ", webhookUrl);

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
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">{endpoint?.label}</h1>

          <p className="text-text-secondary">Endpoint Inspector</p>
        </div>

        {/* Endpoint Overview */}
        <div className="rounded-lg border border-border-default p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <p className="mb-2 text-sm text-text-secondary">Webhook URL</p>

              <div className="flex items-center gap-2">
                <code className="block overflow-auto rounded-lg bg-background p-3 text-sm">
                  {webhookUrl}
                </code>
                <CopyButton content={webhookUrl} />
              </div>

              <p className="mt-2 text-xs text-text-secondary">
                Endpoint Slug: {endpoint?.slug}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  endpoint?.isActive
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {endpoint?.isActive ? "Active" : "Disabled"}
              </span>

              <span className="text-sm text-text-secondary">
                {endpoint?.requestCount ?? 0} Requests
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-text-secondary">
            Send requests from Postman, Stripe, GitHub, Zapier, Axios, Fetch,
            cURL or any HTTP client.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border-default">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            end={tab.label === "Requests"}
            className={({ isActive }) =>
              `px-4 py-2 text-sm ${
                isActive
                  ? "border-b-2 border-primary font-medium"
                  : "text-text-secondary"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}

export default EndpointLayout;
