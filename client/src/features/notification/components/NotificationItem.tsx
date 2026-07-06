import { useState } from "react";
import { Bell, FolderKanban, Shield, UserPlus, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/shared/components/ui/Button";
import { useNotificationStore } from "@/store/notification.store";

import type { Notification } from "../types/notification.types";
import { acceptInvitation } from "../api/acceptInvitation";
import { declineInvitation } from "../api/declineInvitation";

interface NotificationItemProps {
  notification: Notification;
  onActionComplete?: () => void;
}

function NotificationItem({
  notification,
  onActionComplete,
}: NotificationItemProps) {
  const { markAsRead, removeNotification, removeNotificationLocal } =
    useNotificationStore();

  const [isHandling, setIsHandling] = useState(false);
  const [handled, setHandled] = useState(false);

  const token = notification.data.token;

  const handleCardClick = async () => {
    if (notification.isRead) return;

    try {
      await markAsRead(notification._id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  const notificationIcon = () => {
    switch (notification.type) {
      case "workspace_invite":
        return <UserPlus className="size-5 text-blue-500" />;

      case "member_joined":
        return <Users className="size-5 text-green-500" />;

      case "member_left":
        return <Users className="size-5 text-red-500" />;

      case "project_created":
        return <FolderKanban className="size-5 text-yellow-500" />;

      case "role_changed":
        return <Shield className="size-5 text-purple-500" />;

      default:
        return <Bell className="size-5 text-text-secondary" />;
    }
  };

  const finishAction = async (action: () => Promise<void>) => {
    if (!token) return;

    try {
      setIsHandling(true);

      await action();

      setHandled(true);

      onActionComplete?.();

      removeNotificationLocal(notification._id);

      try {
        await removeNotification(notification._id);
      } catch (error) {
        console.error("Failed to remove notification from server", error);
      }
    } catch (error) {
      console.error("Notification action failed", error);
    } finally {
      setIsHandling(false);
    }
  };

  const handleAccept = async () => {
    if (!token) return;

    await finishAction(() => acceptInvitation(token));
  };

  const handleDecline = async () => {
    if (!token) return;

    await finishAction(() => declineInvitation(token));
  };

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer border-b border-border-default p-4 transition-colors hover:bg-bg-hover ${
        !notification.isRead ? "bg-accent/5" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0">{notificationIcon()}</div>

        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium text-text-primary">
                {notification.title}
              </h3>

              <p className="mt-1 text-sm text-text-secondary">
                {notification.message}
              </p>

              <p className="mt-2 text-xs text-text-secondary">{timeAgo}</p>
            </div>

            {!notification.isRead && (
              <div className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
            )}
          </div>

          {notification.actionRequired && !handled && (
            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1"
                disabled={isHandling}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAccept();
                }}
              >
                {isHandling ? "Working..." : "Accept"}
              </Button>

              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={isHandling}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDecline();
                }}
              >
                {isHandling ? "Working..." : "Decline"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationItem;
