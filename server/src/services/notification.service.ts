import { Notification } from "../models/notification.model";
import { emitNotificationNew } from "../socket/events";

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

  message: string;

  actionRequired?: boolean;

  data?: Record<string, any>;
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  actionRequired = false,
  data = {},
}: CreateNotificationParams) {
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    actionRequired,
    data,
  });

  emitNotificationNew(userId, notification);

  return notification;
}
