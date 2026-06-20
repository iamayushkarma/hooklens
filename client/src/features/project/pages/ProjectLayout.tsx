import { Outlet } from "react-router-dom";

function ProjectLayout() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Project</h1>

        <p className="text-text-secondary">Project Management</p>
      </div>

      <div>Project Navigation Here</div>

      <Outlet />
    </div>
  );
}

export default ProjectLayout;
