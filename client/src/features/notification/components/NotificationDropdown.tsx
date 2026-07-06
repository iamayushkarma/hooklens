import { useEffect } from "react";

import { useNotificationStore } from "@/store/notification.store";

import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
}

function NotificationDropdown({ open, onClose }: NotificationDropdownProps) {
  const { notifications, loading, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-border-default bg-bg-card shadow-xl">
      <div className="border-b border-border-default p-4">
        <h2 className="font-semibold">Notifications</h2>
      </div>

      <div className="max-h-125 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-text-secondary">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onActionComplete={onClose}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationDropdown;
