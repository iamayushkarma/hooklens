import api from "@/shared/api/axios";

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const res = await api.patch("/auth/me/password", payload);

  return res.data;
}
