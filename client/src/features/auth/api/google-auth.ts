import api from "@/shared/api/axios";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";

export const googleAuthApi = async (idToken: string) => {
  const { data } = await api.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, {
    idToken,
  });

  return data;
};
