import { Router } from "express";

import { authenticateUser } from "../middleware/auth.middleware";
import {
  deleteNotification,
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller";

const router = Router();

router.use(authenticateUser);

router.get("/", getNotifications);

router.patch("/:id/read", markNotificationAsRead);

router.delete("/:id", deleteNotification);

export default router;
