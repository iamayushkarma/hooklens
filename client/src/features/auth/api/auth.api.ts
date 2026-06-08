import api from "@/shared/api/axios";

import type {
  LoginInput,
  AuthResponse,
  ApiResponse,
} from "@/shared/types/auth.types";

export const login = async (
  data: LoginInput,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await api.post("/auth/login", data);

  return response.data;
};
