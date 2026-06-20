import { NavLink, Outlet } from "react-router-dom";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";

function WorkspaceLayout() {
  const { currentWorkspace, currentWorkspaceId } = useCurrentWorkspace();

  const tabs = [
    {
      label: "Projects",
      path: `/dashboard/workspaces/${currentWorkspaceId}`,
    },
    {
      label: "Members",
      path: `/dashboard/workspaces/${currentWorkspaceId}/members`,
    },
    {
      label: "Invitations",
      path: `/dashboard/workspaces/${currentWorkspaceId}/invitations`,
    },
    {
      label: "Settings",
      path: `/dashboard/workspaces/${currentWorkspaceId}/settings`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border-default pb-4">
        <h1 className="text-2xl font-semibold">{currentWorkspace?.name}</h1>

        <div className="mt-2 flex items-center gap-4 text-sm text-text-secondary">
          <span className="capitalize">{currentWorkspace?.yourRole}</span>

          <span>{currentWorkspace?.memberCount} Members</span>

          <span>{currentWorkspace?.projectCount} Projects</span>
        </div>
      </div>
      {/* Navigation */}
      <div className="flex gap-2 border-b border-border-default">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            end
            className={({ isActive }) =>
              `px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "border-b-2 border-blue-500 font-medium"
                  : "text-text-secondary"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      {/* Page Content */}
      <Outlet />
    </div>
  );
}

export default WorkspaceLayout;
