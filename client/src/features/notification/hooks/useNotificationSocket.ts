import { useEffect } from "react";

import { socket } from "@/socket/sockets";
import { useNotificationStore } from "@/store/notification.store";

import type { Notification } from "../types/notification.types";

export function useNotificationSocket() {
  useEffect(() => {
    const { addNotification, markAsReadLocal, removeNotificationLocal } =
      useNotificationStore.getState();

    const handleNewNotification = ({
      notification,
    }: {
      notification: Notification;
    }) => {
      addNotification(notification);
    };

    const handleNotificationRead = ({
      notificationId,
    }: {
      notificationId: string;
    }) => {
      markAsReadLocal(notificationId);
    };

    const handleNotificationDeleted = ({
      notificationId,
    }: {
      notificationId: string;
    }) => {
      removeNotificationLocal(notificationId);
    };

    socket.on("notification:new", handleNewNotification);

    socket.on("notification:read", handleNotificationRead);

    socket.on("notification:deleted", handleNotificationDeleted);

    return () => {
      socket.off("notification:new", handleNewNotification);

      socket.off("notification:read", handleNotificationRead);

      socket.off("notification:deleted", handleNotificationDeleted);
    };
  }, []);
}
