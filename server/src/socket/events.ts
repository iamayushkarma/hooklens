import { io, getRoomName, getUserRoomName } from "./index";
import type { IRequestLog } from "../models/requestLog.model";

// All emit calls go through here.
// If an event name changes, fix it in one place — not scattered across files.

export const emitRequestNew = (slug: string, request: IRequestLog): void => {
  io?.to(getRoomName(slug)).emit("request:new", { request });
};

export const emitRequestDeleted = (slug: string, requestId: string): void => {
  io?.to(getRoomName(slug)).emit("request:deleted", { requestId });
};

export const emitEndpointDisabled = (slug: string): void => {
  io?.to(getRoomName(slug)).emit("endpoint:disabled", { slug });
};

export const emitNotificationNew = (
  userId: string,
  notification: unknown,
): void => {
  io?.to(getUserRoomName(userId)).emit("notification:new", {
    notification,
  });
};

export const emitNotificationRead = (
  userId: string,
  notificationId: string,
): void => {
  io?.to(getUserRoomName(userId)).emit("notification:read", {
    notificationId,
  });
};

export const emitNotificationDeleted = (
  userId: string,
  notificationId: string,
): void => {
  io?.to(getUserRoomName(userId)).emit("notification:deleted", {
    notificationId,
  });
};
