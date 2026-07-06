import { create } from "zustand";
import { loginApi } from "@/features/auth/api/login";
import { registerApi } from "@/features/auth/api/register";
import { getCurrentUserApi } from "@/features/auth/api/get-current-user";
import type { User } from "@/features/auth/types/auth.types";
import { googleLoginApi } from "@/features/auth/api/google-login";
import { googleAuthApi } from "@/features/auth/api/google-auth";
import { getWorkspaces } from "@/features/workspace/api/getWorkspaces";
import { useWorkspaceStore } from "./workspace.store";
import { useNotificationStore } from "./notification.store";

interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
  initialized: boolean;
  googleLogin: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<void>;

  initialize: () => Promise<void>;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  initialized: false,

  googleLogin: async () => {
    const { idToken } = await googleLoginApi();

    const response = await googleAuthApi(idToken);
    localStorage.setItem("token", response.data.token);

    const workspaces = await getWorkspaces();
    if (workspaces.length) {
      useWorkspaceStore.getState().setCurrentWorkspaceId(workspaces[0]._id);
    }

    set({
      token: response.data.token,
      user: response.data.user,
      initialized: true,
    });
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const response = await loginApi(email, password);

      localStorage.setItem("token", response.data.token);

      const workspaces = await getWorkspaces();
      if (workspaces.length) {
        useWorkspaceStore.getState().setCurrentWorkspaceId(workspaces[0]._id);
      }
      await useNotificationStore.getState().fetchNotifications();

      await useNotificationStore.getState().fetchUnreadCount();
      set({
        user: response.data.user,
        token: response.data.token,
        loading: false,
        initialized: true,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  register: async (fullName, email, password) => {
    set({ loading: true });

    try {
      const response = await registerApi(fullName, email, password);

      localStorage.setItem("token", response.data.token);

      const workspaces = await getWorkspaces();
      if (workspaces.length) {
        useWorkspaceStore.getState().setCurrentWorkspaceId(workspaces[0]._id);
      }

      set({
        user: response.data.user,
        token: response.data.token,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  initialize: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ initialized: true });
      return;
    }

    try {
      const response = await getCurrentUserApi();
      const workspaceStore = useWorkspaceStore.getState();
      if (!workspaceStore.currentWorkspaceId) {
        const workspaces = await getWorkspaces();

        if (workspaces.length) {
          workspaceStore.setCurrentWorkspaceId(workspaces[0]._id);
        }
      }
      set({
        user: response.data.data,
        token,
        initialized: true,
      });
    } catch {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
        initialized: true,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    useNotificationStore.setState({
      notifications: [],
      unreadCount: 0,
    });
    set({
      user: null,
      token: null,
      initialized: true,
    });
  },
}));
