import { Router } from "express";
import {
  getWorkspaceAnalytics,
  getEndpointAnalytics,
} from "../controllers/analytics.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { apiRateLimit } from "../middleware/rateLimit.middleware";

const router = Router();

router.use(authenticateUser);
router.use(apiRateLimit);

router.get("/workspace/:id", getWorkspaceAnalytics);
router.get("/endpoint/:id", getEndpointAnalytics);

export default router;
