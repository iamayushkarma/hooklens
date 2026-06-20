import { NavLink, Outlet, useParams } from "react-router-dom";

function WorkspaceLayout() {
  const { workspaceId } = useParams();

  const tabs = [
    {
      label: "Overview",
      path: `/dashboard/workspaces/${workspaceId}`,
    },
    {
      label: "Projects",
      path: `/dashboard/workspaces/${workspaceId}/projects`,
    },
    {
      label: "Members",
      path: `/dashboard/workspaces/${workspaceId}/members`,
    },
    {
      label: "Invitations",
      path: `/dashboard/workspaces/${workspaceId}/invitations`,
    },
    {
      label: "Settings",
      path: `/dashboard/workspaces/${workspaceId}/settings`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Workspace</h1>

        <p className="text-text-secondary">Workspace Management</p>
      </div>

      {/* Navigation */}
      <div className="flex gap-2 border-b border-border-default">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            end={tab.label === "Overview"}
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
