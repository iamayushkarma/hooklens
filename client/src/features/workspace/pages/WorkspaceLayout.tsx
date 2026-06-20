import { NavLink, Outlet } from "react-router-dom";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";
function WorkspaceLayout() {
  const { currentWorkspaceId } = useCurrentWorkspace();

  const tabs = [
    {
      label: "Overview",
      path: `/dashboard/workspaces/${currentWorkspaceId}`,
    },
    {
      label: "Projects",
      path: `/dashboard/workspaces/${currentWorkspaceId}/projects`,
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
        <h1 className="text-2xl font-semibold">Workspace Name</h1>

        <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
          <span>Owner</span>
          <span>3 Members</span>
          <span>12 Projects</span>
          <p>{currentWorkspaceId}</p>
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
