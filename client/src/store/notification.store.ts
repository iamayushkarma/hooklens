import { create } from "zustand";

import { getNotifications } from "@/features/notification/api/getNotifications";

import { getUnreadCount } from "@/features/notification/api/getUnreadCount";

import { markNotificationRead } from "@/features/notification/api/markNotificationRead";

import { deleteNotification } from "@/features/notification/api/deleteNotification";

import type { Notification } from "@/features/notification/types/notification.types";
import { markAllNotificationsRead } from "@/features/notification/api/markAllNotificationsRead";

interface NotificationStore {
  notifications: Notification[];

  unreadCount: number;

  loading: boolean;

  markAsReadLocal: (notificationId: string) => void;

  removeNotificationLocal: (notificationId: string) => void;

  fetchNotifications: () => Promise<void>;

  fetchUnreadCount: () => Promise<void>;

  markAllAsRead: () => Promise<void>;

  markAsRead: (notificationId: string) => Promise<void>;

  removeNotification: (notificationId: string) => Promise<void>;

  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  unreadCount: 0,

  loading: false,

  markAsReadLocal: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification._id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
      unreadCount: Math.max(state.unreadCount - 1, 0),
    }));
  },

  markAllAsRead: async () => {
    await markAllNotificationsRead();

    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      })),
      unreadCount: 0,
    }));
  },
  removeNotificationLocal: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification._id !== notificationId,
      ),
    }));
  },

  fetchNotifications: async () => {
    try {
      set({ loading: true });

      const notifications = await getNotifications();

      set({
        notifications,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    const count = await getUnreadCount();

    set({
      unreadCount: count,
    });
  },

  markAsRead: async (notificationId) => {
    await markNotificationRead(notificationId);

    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification._id === notificationId
          ? {
              ...notification,
              isRead: true,
            }
          : notification,
      ),

      unreadCount: Math.max(state.unreadCount - 1, 0),
    }));
  },

  removeNotification: async (notificationId) => {
    await deleteNotification(notificationId);

    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification._id !== notificationId,
      ),
    }));
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],

      unreadCount: state.unreadCount + 1,
    }));
  },
}));
