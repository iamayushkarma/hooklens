import { useWorkspaceStore } from "@/store/workspace.store";

export function useCurrentProject() {
  const currentProjectId = useWorkspaceStore((state) => state.currentProjectId);

  return {
    currentProjectId,
  };
}
