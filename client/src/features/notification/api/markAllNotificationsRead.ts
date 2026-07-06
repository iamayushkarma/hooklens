import api from "@/shared/api/axios";

export async function markAllNotificationsRead() {
  const res = await api.patch("/notifications/read-all");

  return res.data.data;
}
