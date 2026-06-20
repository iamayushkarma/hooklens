import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { WorkspaceProp } from "@/features/workspace/types/workspace.type";
import type { Project } from "@/features/project/types/project.types";

interface WorkspaceStore {
  workspaces: WorkspaceProp[];
  projects: Project[];

  currentWorkspaceId: string | null;
  currentProjectId: string | null;

  setWorkspaces: (workspaces: WorkspaceProp[]) => void;
  setProjects: (projects: Project[]) => void;

  setCurrentWorkspaceId: (id: string) => void;
  setCurrentProjectId: (id: string) => void;

  clearSelection: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],
      projects: [],

      currentWorkspaceId: null,
      currentProjectId: null,

      setWorkspaces: (workspaces) =>
        set({
          workspaces,
        }),

      setProjects: (projects) =>
        set({
          projects,
        }),

      setCurrentWorkspaceId: (id) =>
        set({
          currentWorkspaceId: id,
        }),

      setCurrentProjectId: (id) =>
        set({
          currentProjectId: id,
        }),

      clearSelection: () =>
        set({
          workspaces: [],
          projects: [],
          currentWorkspaceId: null,
          currentProjectId: null,
        }),
    }),
    {
      name: "workspace-storage",
    },
  ),
);
