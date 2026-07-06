import { Request, Response } from "express";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { Notification } from "../models/notification.model";
import { ok } from "../utils/response";

export const getNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const notifications = await Notification.find({
      userId: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return ok(res, notifications);
  },
);
