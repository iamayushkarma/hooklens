import api from "@/shared/api/axios";
import { API_ENDPOINTS } from "@/shared/constants/api-endpoints";

export const getCurrentUserApi = async () => {
  const data = await api.get(API_ENDPOINTS.AUTH.ME);

  return data;
};
