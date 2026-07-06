import { useState } from "react";

import { Button } from "@/shared/components/ui/Button";

import type { Notification } from "../types/notification.types";
import { acceptInvitation } from "../api/acceptInvitation";
import { declineInvitation } from "../api/declineInvitation";
import { useNotificationStore } from "@/store/notification.store";
interface NotificationItemProps {
  notification: Notification;
  onActionComplete?: () => void;
}

function NotificationItem({
  notification,
  onActionComplete,
}: NotificationItemProps) {
  const { removeNotification, removeNotificationLocal } =
    useNotificationStore();
  const [isHandling, setIsHandling] = useState(false);
  const [handled, setHandled] = useState(false);

  const finishAction = async (action: () => Promise<void>) => {
    try {
      setIsHandling(true);
      await action();

      setHandled(true);
      onActionComplete?.();
      removeNotificationLocal(notification._id);

      try {
        await removeNotification(notification._id);
      } catch (readError) {
        console.error("Failed to remove notification from server", readError);
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
      className={`border-b border-border-default p-4 ${
        !notification.isRead ? "bg-accent/5" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{notification.title}</h3>

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
            onClick={handleAccept}
            disabled={isHandling}
          >
            {isHandling ? "Working..." : "Accept"}
          </Button>

          <Button
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={handleDecline}
            disabled={isHandling}
          >
            {isHandling ? "Working..." : "Decline"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationItem;
