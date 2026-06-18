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

const router = Router();
router.use(authenticateUser);

router.get("/", getProjects);
router.post("/", validate(createProjectSchema), createProject);
router.patch(
  "/:id",
  requireProjectRole("member"),
  validate(updateProjectSchema),
  updateProject,
);
router.delete("/:id", requireProjectRole("admin"), deleteProject);

export default router;
