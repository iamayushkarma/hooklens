import api from "@/shared/api/axios";
import type { Notification } from "../types/notification.types";

export async function getNotifications() {
  const res = await api.get("/notifications");

  return res.data.data as Notification[];
}
