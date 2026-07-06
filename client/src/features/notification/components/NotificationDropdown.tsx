import { useEffect } from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/notification.store";

import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
}

function NotificationDropdown({ open, onClose }: NotificationDropdownProps) {
  const {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-96 rounded-xl border border-border-default bg-bg-card shadow-xl">
      <div className="flex items-center justify-between border-b border-border-default p-4">
        <h2 className="font-semibold">Notifications</h2>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm font-medium text-accent hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="max-h-125 overflow-y-auto">
        {loading ? (
          <div className="p-6 text-center">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="rounded-full bg-bg-hover p-4">
              <Bell className="size-6 text-text-secondary" />
            </div>

            <div className="text-center">
              <h3 className="font-medium text-text-primary">
                You're all caught up
              </h3>

              <p className="mt-1 text-sm text-text-secondary">
                No new notifications.
              </p>
            </div>
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
