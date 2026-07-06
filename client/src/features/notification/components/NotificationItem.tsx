import { useState } from "react";

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

  const handleCardClick = async () => {
    if (notification.isRead) return;

    try {
      await markAsRead(notification._id);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const finishAction = async (action: () => Promise<void>) => {
    const token = notification.data.token;

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
        console.error("Failed to remove notification", error);
      }
    } catch (error) {
      console.error("Notification action failed", error);
    } finally {
      setIsHandling(false);
    }
  };

  const handleAccept = async () => {
    await finishAction(() => acceptInvitation(notification.data.token!));
  };

  const handleDecline = async () => {
    await finishAction(() => declineInvitation(notification.data.token!));
  };

  return (
    <div
      onClick={handleCardClick}
      className={`cursor-pointer border-b border-border-default p-4 transition-colors hover:bg-bg-hover ${
        !notification.isRead ? "bg-accent/5" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-medium text-text-primary">
            {notification.title}
          </h3>

          <p className="mt-1 text-sm text-text-secondary">
            {notification.message}
          </p>
        </div>

        {!notification.isRead && (
          <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
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
  );
}

export default NotificationItem;
