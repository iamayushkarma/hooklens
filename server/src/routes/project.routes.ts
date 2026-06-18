import { Router } from "express";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";

import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator";

const router = Router();
router.use(authenticateUser);

router.get("/", getProjects);
router.post("/", validate(createProjectSchema), createProject);
router.patch("/:id", validate(updateProjectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
