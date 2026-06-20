import { useWorkspaceStore } from "@/store/workspace.store";

export function useCurrentProject() {
  const projects = useWorkspaceStore((state) => state.projects);

  const currentProjectId = useWorkspaceStore((state) => state.currentProjectId);

  const currentProject = projects.find(
    (project) => project._id === currentProjectId,
  );

  return {
    currentProject,
    currentProjectId,
  };
}
