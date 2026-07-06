import api from "@/shared/api/axios";

export async function getUnreadCount() {
  const res = await api.get("/notifications/unread-count");

  return res.data.data.count as number;
}
