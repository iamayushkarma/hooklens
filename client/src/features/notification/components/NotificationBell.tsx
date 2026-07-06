import { Bell } from "lucide-react";
import { useNotificationStore } from "@/store/notification.store";
import { useRef, useState } from "react";
import { useClickOutside } from "@/shared/hooks/useClickOutside";
import NotificationDropdown from "./NotificationDropdown";

function NotificationBell() {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => {
    setOpen(false);
  });
  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-bg-hover"
      >
        <Bell className="size-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <NotificationDropdown open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export default NotificationBell;
