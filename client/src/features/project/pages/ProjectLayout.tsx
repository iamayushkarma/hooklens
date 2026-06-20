import { Outlet } from "react-router-dom";
import { useCurrentProject } from "../hooks/useCurrentProject";
function ProjectLayout() {
  const { currentProject } = useCurrentProject();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">{currentProject?.name}</h1>

        <p className="text-text-secondary">Project Management</p>
      </div>

      <div>Project Navigation Here</div>
      <div className="flex items-center gap-4 text-sm text-text-secondary">
        <span>{currentProject?.endpointCount} Endpoints</span>

        <span>{currentProject?.requestCount} Requests</span>
      </div>
      <Outlet />
    </div>
  );
}

export default ProjectLayout;
