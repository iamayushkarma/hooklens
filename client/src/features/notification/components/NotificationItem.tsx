import { Button } from "@/shared/components/ui/Button";

import type { Notification } from "../types/notification.types";
import { acceptInvitation } from "../api/acceptInvitation";
import { declineInvitation } from "../api/declineInvitation";
import { useNotificationStore } from "@/store/notification.store";
interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  const { markAsRead } = useNotificationStore();

  const handleAccept = async () => {
    await acceptInvitation(notification.data.token!);

    await markAsRead(notification._id);
  };

  const handleDecline = async () => {
    await declineInvitation(notification.data.token!);

    await markAsRead(notification._id);
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

      {notification.actionRequired && (
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" onClick={handleAccept}>
            Accept
          </Button>

          <Button
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={handleDecline}
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationItem;
