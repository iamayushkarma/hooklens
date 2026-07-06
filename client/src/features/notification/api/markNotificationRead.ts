import api from "@/shared/api/axios";

export async function markNotificationRead(notificationId: string) {
  const res = await api.patch(`/notifications/${notificationId}/read`);

  return res.data.data;
}
