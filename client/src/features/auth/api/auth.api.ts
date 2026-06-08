import api from "@/shared/api/axios";
import type { AuthResponse } from "@/features/auth/types/auth.types";

export const loginApi = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });

  return data;
};
