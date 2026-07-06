import { Router } from "express";

import { authenticateUser } from "../middleware/auth.middleware";
import {
  deleteNotification,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notification.controller";

const router = Router();

router.use(authenticateUser);

router.get("/", getNotifications);

router.get("/unread-count", getUnreadNotificationCount);
router.patch("/read-all", markAllNotificationsAsRead);

router.patch("/:id/read", markNotificationAsRead);

router.delete("/:id", deleteNotification);

export default router;
