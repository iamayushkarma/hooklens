import { NavLink, Outlet } from "react-router-dom";
import { useCurrentWorkspace } from "../hooks/useCurrentWorkspace";
import { RoleBadge } from "@/shared/components/ui/role-badge";
import { FolderKanban, UsersRound } from "lucide-react";

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
      <div className="pb-4">
        <h1 className="text-2xl font-semibold">{currentWorkspace?.name}</h1>

        <div className="mt-4 flex items-center gap-5 text-sm text-text-secondary">
          <RoleBadge role={currentWorkspace?.yourRole!} />

          <div className="flex items-center justify-center gap-1.5">
            <UsersRound className="size-4" />
            <span>{currentWorkspace?.memberCount} Members</span>
          </div>

          <div className="flex items-center justify-center gap-1.5">
            <FolderKanban className="size-4" />
            <span>{currentWorkspace?.projectCount} Projects</span>
          </div>
        </div>
      </div>
      {/* Navigation */}
      <div className="flex gap-2 bg-bg-sidebar border border-border-default w-fit rounded-md p-0.75">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            end
            className={({ isActive }) =>
              `px-2.5 py-1.5 text-sm rounded-[5px] transition-colors ${
                isActive ? "bg-bg-card font-medium" : "text-text-secondary"
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
