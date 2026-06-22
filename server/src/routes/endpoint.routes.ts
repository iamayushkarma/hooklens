import { Router } from "express";
import {
  getEndpoint,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  getEndpointRequests,
  sendTestRequest,
} from "../controllers/endpoint.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { apiRateLimit } from "../middleware/rateLimit.middleware";

const router = Router();

// All endpoint routes require auth
router.use(authenticateUser);
router.use(apiRateLimit);

router.get("/", getEndpoint);
router.post("/", createEndpoint);
router.patch("/:id", updateEndpoint);
router.delete("/:id", deleteEndpoint);
router.post("/:id/test", sendTestRequest);
router.get("/:id/requests", getEndpointRequests);

export default router;
