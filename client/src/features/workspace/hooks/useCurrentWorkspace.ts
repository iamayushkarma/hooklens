import { useWorkspaceStore } from "@/store/workspace.store";

export function useCurrentWorkspace() {
  const workspaces = useWorkspaceStore((state) => state.workspaces);

  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId,
  );

  const currentWorkspace = workspaces.find(
    (workspace) => workspace._id === currentWorkspaceId,
  );

  return {
    currentWorkspace,
    currentWorkspaceId,
  };
}
