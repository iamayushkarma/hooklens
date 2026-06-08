import api from "@/shared/api/axios";
import type { AuthResponse } from "@/features/auth/types/auth.types";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";

export const loginApi = async (email: string, password: string) => {
  console.log("BASE URL:", api.defaults.baseURL);
  console.log("logn api: ", API_ENDPOINTS.AUTH.LOGIN);

  const { data } = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password,
  });

  return data;
};
