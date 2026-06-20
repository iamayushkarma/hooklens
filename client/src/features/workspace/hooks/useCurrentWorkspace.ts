import { useWorkspaceStore } from "@/store/workspace.store";

export function useCurrentWorkspace() {
  const currentWorkspaceId = useWorkspaceStore(
    (state) => state.currentWorkspaceId,
  );

  return {
    currentWorkspaceId,
  };
}
