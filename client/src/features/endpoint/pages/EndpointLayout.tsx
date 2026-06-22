import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { Copy } from "lucide-react";
import { Outlet, NavLink, useParams } from "react-router-dom";
function EndpointLayout() {
  const endpoint = useCurrentEndpoint();
  const { workspaceId, projectId, endpointId } = useParams();
  const webhookUrl = `${import.meta.env.VITE_API_BASE_URL}/h/${endpoint?.slug}`;

  const handleCopyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
    } catch (error) {
      console.error(error);
    }
  };
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
        <div>
          <h1 className="text-2xl font-semibold">{endpoint?.label}</h1>

          <p className="text-text-secondary">Endpoint Inspector</p>
        </div>

        <div className="rounded-lg border border-border-default p-4">
          <p className="mb-2 text-sm text-text-secondary">Webhook URL</p>

          <div className="flex items-center gap-3">
            <code className="flex-1 overflow-auto rounded-lg bg-background p-3 text-sm">
              {webhookUrl}
            </code>

            <button
              onClick={handleCopyWebhook}
              className="rounded-lg border border-border-default p-3"
            >
              <Copy size={16} />
            </button>
          </div>

          <p className="mt-3 text-xs text-text-secondary">
            Send requests from Postman, Stripe, GitHub, Zapier, Axios, Fetch or
            any HTTP client.
          </p>
        </div>
      </div>
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
