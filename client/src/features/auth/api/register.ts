import api from "@/shared/api/axios";
import type { AuthResponse } from "@/features/auth/types/auth.types";

export const registerApi = async (
  fullname: string,
  email: string,
  password: string,
) => {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    fullname,
    email,
    password,
  });
  return data;
};
