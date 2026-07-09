import api from "@/shared/api/axios";

export async function deleteAccount() {
  const res = await api.delete("/auth/me");

  return res.data;
}
