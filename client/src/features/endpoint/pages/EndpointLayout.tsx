import { useCurrentEndpoint } from "../hooks/useCurrentEndpoint";
import { Outlet, NavLink, useParams } from "react-router-dom";
function EndpointLayout() {
  const endpoint = useCurrentEndpoint();
  const { workspaceId, projectId, endpointId } = useParams();

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
      <div>
        <h1 className="text-2xl font-semibold">{endpoint?.label}</h1>

        <p className="text-text-secondary">/{endpoint?.slug}</p>
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
