import { Router } from "express";
import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
} from "../controllers/workspace.controller";
import { authenticateUser } from "../middleware/auth.middleware";

const router = Router();
router.use(authenticateUser);

router.get("/", getWorkspaces);
router.post("/", createWorkspace);
router.patch("/:id", updateWorkspace);
router.delete("/:id", deleteWorkspace);
router.get("/:id/members", getMembers);

export default router;
