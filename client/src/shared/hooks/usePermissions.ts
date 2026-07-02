import { useCurrentWorkspace } from "@/features/workspace/hooks/useCurrentWorkspace";

export function usePermissions() {
  const { currentWorkspace } = useCurrentWorkspace();

  const role = currentWorkspace?.yourRole;

  return {
    role,

    isOwner: role === "owner",

    isAdmin: role === "admin",

    isMember: role === "member",

    isViewer: role === "viewer",

    canInviteMembers: role === "owner" || role === "admin",

    canManageMembers: role === "owner" || role === "admin",

    canCreateProject: role === "owner" || role === "admin" || role === "member",

    canDeleteWorkspace: role === "owner",

    canViewSettings: role === "owner" || role === "admin",
  };
}
