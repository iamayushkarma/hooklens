import { Button } from "@/shared/components/ui/Button";

import type { Notification } from "../types/notification.types";

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
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
          <Button className="flex-1">Accept</Button>

          <Button className="flex-1 bg-red-600 hover:bg-red-700">
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}

export default NotificationItem;
