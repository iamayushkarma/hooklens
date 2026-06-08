import { create } from "zustand";
import { loginApi } from "@/features/auth/api/login";
import { registerApi } from "@/features/auth/api/register";
import { getCurrentUserApi } from "@/features/auth/api/get-current-user";
import type { User } from "@/features/auth/types/auth.types";
import { googleLoginApi } from "@/features/auth/api/google-login";
import { googleAuthApi } from "@/features/auth/api/google-auth";
interface AuthStore {
  user: User | null;
  token: string | null;
  loading: boolean;
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

  googleLogin: async () => {
    const { idToken } = await googleLoginApi();

    const response = await googleAuthApi(idToken);

    localStorage.setItem("token", response.data.token);

    set({
      token: response.data.token,
      user: response.data.user,
    });
  },

  login: async (email, password) => {
    set({ loading: true });

    try {
      const response = await loginApi(email, password);

      localStorage.setItem("token", response.data.token);

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

  register: async (fullName, email, password) => {
    set({ loading: true });

    try {
      const response = await registerApi(fullName, email, password);

      localStorage.setItem("token", response.data.token);

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

    if (!token) return;

    try {
      const response = await getCurrentUserApi();

      set({
        user: response.data,
        token,
      });
    } catch {
      localStorage.removeItem("token");

      set({
        user: null,
        token: null,
      });
    }
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      user: null,
      token: null,
    });
  },
}));
