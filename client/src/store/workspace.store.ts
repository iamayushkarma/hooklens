import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WorkspaceProp } from "@/features/workspace/types/workspace.type";

interface WorkspaceStore {
  workspaces: WorkspaceProp[];

  currentWorkspaceId: string | null;
  currentProjectId: string | null;

  setWorkspaces: (workspaces: WorkspaceProp[]) => void;

  setCurrentWorkspaceId: (id: string) => void;
  setCurrentProjectId: (id: string) => void;

  clearSelection: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspaces: [],

      currentWorkspaceId: null,
      currentProjectId: null,

      setWorkspaces: (workspaces) =>
        set({
          workspaces,
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
          currentWorkspaceId: null,
          currentProjectId: null,
        }),
    }),
    {
      name: "workspace-storage",
    },
  ),
);
