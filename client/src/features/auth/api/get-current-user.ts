import api from "@/shared/api/axios";

export const getCurrentUserApi = async () => {
  const data = await api.get("/auth/me");

  return data;
};
