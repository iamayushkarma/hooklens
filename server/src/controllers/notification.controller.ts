import { Request, Response } from "express";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { Notification } from "../models/notification.model";
import { ok } from "../utils/response";

const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const notifications = await Notification.find({
    userId: req.user.userId,
  })
    .sort({ createdAt: -1 })
    .lean();

  return ok(res, notifications);
});
const markNotificationAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!notification) {
      throw new ApiError(404, "Notification not found");
    }

    notification.isRead = true;

    await notification.save();

    return ok(res, notification);
  },
);
const markAllNotificationsAsRead = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    await Notification.updateMany(
      {
        userId: req.user.userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    return ok(res, null, "All notifications marked as read");
  },
);
const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  await notification.deleteOne();

  return ok(res, null, "Notification deleted");
});
const getUnreadNotificationCount = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const count = await Notification.countDocuments({
      userId: req.user.userId,
      isRead: false,
    });

    return ok(res, { count });
  },
);
export {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationCount,
};
