import { useCurrentProject } from "../hooks/useCurrentProject";
import { useAppNavigation } from "@/shared/hooks/useAppNavigation";
import { ArrowLeft } from "lucide-react";

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
    <>
      <button
        className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm mb-4 cursor-pointer group"
        onClick={() => goToWorkspace(workspaceId!)}
      >
        <span className="group-hover:-translate-x-0.5 duration-150 transition-all">
          <ArrowLeft className="size-4" />
        </span>{" "}
        Back to Workspace
      </button>
      <div className="flex flex-col gap-6">
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
    </>
  );
}

export default ProjectLayout;
