import { Router } from "express";

import { authenticateUser } from "../middleware/auth.middleware";
import { getNotifications } from "../controllers/notification.controller";

const router = Router();

router.use(authenticateUser);

router.get("/", getNotifications);

export default router;
