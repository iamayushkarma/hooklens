import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { requireProjectRole } from "../middleware/project-rbac.middleware";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator";
import { requireWorkspaceBodyRole } from "../middleware/workspace-body-rbac.middleware";

const router = Router();
router.use(authenticateUser);

router.get("/", getProjects);
router.post(
  "/",
  requireWorkspaceBodyRole("admin"),
  validate(createProjectSchema),
  createProject,
);
router.patch(
  "/:id",
  requireProjectRole("member"),
  validate(updateProjectSchema),
  updateProject,
);
router.delete("/:id", requireProjectRole("admin"), deleteProject);

export default router;
