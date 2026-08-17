import Tabs from "@/shared/components/ui/Tabs";
import BackButton from "@/shared/components/ui/BackButton";
import { useCurrentProject } from "../hooks/useCurrentProject";

import { Outlet, useParams } from "react-router-dom";
function ProjectLayout() {
  const { currentProject } = useCurrentProject();
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
  ];
  return (
    <>
      <BackButton
        fallbackHref={`/dashboard/workspaces/${workspaceId}`}
        label="Back to Workspace"
        className="mb-4"
      />
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold">{currentProject?.name}</h1>

          <p className="text-text-secondary">Project Management</p>
        </div>
        <Tabs tabs={tabs} />
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
