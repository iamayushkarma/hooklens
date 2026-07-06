import api from "@/shared/api/axios";

export async function deleteNotification(notificationId: string) {
  const res = await api.delete(`/notifications/${notificationId}`);

  return res.data.data;
}
