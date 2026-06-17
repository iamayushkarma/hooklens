import { create } from "zustand";

interface WorkspaceStore {
  currentWorkspaceId: string | null;
  currentProjectId: string | null;

  setCurrentWorkspaceId: (id: string) => void;
  setCurrentProjectId: (id: string) => void;

  clearSelection: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  currentWorkspaceId: null,
  currentProjectId: null,

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
}));
