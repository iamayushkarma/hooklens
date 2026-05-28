import { Router } from "express";
import {
  getRequest,
  deleteRequest,
  replayRequestHandler,
  explainRequest,
} from "../controllers/request.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { apiRateLimit } from "../middleware/rateLimit.middleware";

const router = Router();

router.use(authenticateUser);
router.use(apiRateLimit);

router.get("/:id", getRequest);
router.delete("/:id", deleteRequest);
router.post("/:id/replay", replayRequestHandler);
router.post("/:id/explain", explainRequest);

export default router;
