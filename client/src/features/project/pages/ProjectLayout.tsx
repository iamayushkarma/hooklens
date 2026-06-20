import { useCurrentProject } from "../hooks/useCurrentProject";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";

import { NavLink, Outlet, useParams } from "react-router-dom";
function ProjectLayout() {
  const { currentProject } = useCurrentProject();
  const { goToWorkspace } = useAppNavigation();
  const { workspaceId, projectId } = useParams();
  const tabs = [
    {
      label: "Endpoints",
      path: `/dashboard/workspaces/${workspaceId}/projects/${projectId}`,
    },
    {
      label: "Requests",
      path: `/dashboard/workspaces/${workspaceId}/projects/${projectId}/requests`,
    },
    {
      label: "Replays",
      path: `/dashboard/workspaces/${workspaceId}/projects/${projectId}/replays`,
    },
    {
      label: "Analytics",
      path: `/dashboard/workspaces/${workspaceId}/projects/${projectId}/analytics`,
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      <button onClick={() => goToWorkspace(workspaceId!)}>
        ← Back to Workspace
      </button>
      <div>
        <h1 className="text-2xl font-semibold">{currentProject?.name}</h1>

        <p className="text-text-secondary">Project Management</p>
      </div>

      <div className="flex gap-2 border-b border-border-default">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            end
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
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <span>{currentProject?.endpointCount} Endpoints</span>

        <span>{currentProject?.requestCount} Requests</span>
      </div>
      <Outlet />
    </div>
  );
}

export default ProjectLayout;
