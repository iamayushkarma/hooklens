import { Outlet } from "react-router-dom";

function WorkspaceLayout() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Workspace</h1>

        <p className="text-text-secondary">Workspace Management</p>
      </div>

      <div>Workspace Navigation Here</div>

      <Outlet />
    </div>
  );
}

export default WorkspaceLayout;
