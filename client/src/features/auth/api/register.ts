import api from "@/shared/api/axios";
import type { AuthResponse } from "@/features/auth/types/auth.types";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";

export const registerApi = async (
  fullname: string,
  email: string,
  password: string,
) => {
  const { data } = await api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, {
    fullname,
    email,
    password,
  });
  return data;
};
