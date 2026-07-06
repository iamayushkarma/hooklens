import { Notification } from "../models/notification.model";

interface CreateNotificationParams {
  userId: string;
  type:
    | "workspace_invite"
    | "member_joined"
    | "member_left"
    | "role_changed"
    | "project_created"
    | "endpoint_created";

  title: string;
  actionRequired: boolean;
  message: string;
  data?: Record<string, any>;
}

export async function createNotification({
  userId,
  type,
  title,
  actionRequired,
  message,
  data = {},
}: CreateNotificationParams) {
  return Notification.create({
    userId,
    type,
    title,
    actionRequired,
    message,
    data,
  });
}
