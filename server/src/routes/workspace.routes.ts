import { Router } from "express";
import {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
  inviteMember,
  acceptInvite,
  changeMemberRole,
  removeMember,
} from "../controllers/workspace.controller";
import { authenticateUser } from "../middleware/auth.middleware";
import { requireWorkspaceRole } from "../middleware/rbac.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteMemberSchema,
  changeMemberRoleSchema,
} from "../validators/workspace.validator";

const router = Router();
router.use(authenticateUser);

router.get("/", getWorkspaces);
router.post("/", validate(createWorkspaceSchema), createWorkspace);

router.patch(
  "/:id",
  requireWorkspaceRole("admin"),
  validate(updateWorkspaceSchema),
  updateWorkspace,
);
router.delete("/:id", requireWorkspaceRole("owner"), deleteWorkspace);

router.get("/:id/members", requireWorkspaceRole("viewer"), getMembers);
router.post(
  "/:id/invite",
  requireWorkspaceRole("admin"),
  validate(inviteMemberSchema),
  inviteMember,
);

router.get("/invite/accept/:token", acceptInvite);

router.patch(
  "/:id/members/:userId/role",
  requireWorkspaceRole("admin"),
  validate(changeMemberRoleSchema),
  changeMemberRole,
);
router.delete(
  "/:id/members/:userId",
  requireWorkspaceRole("admin"),
  removeMember,
);

export default router;

// router.use(authenticateUser);

// router.get("/invite/accept/:token", acceptInvite);

// router.get("/", getWorkspaces);
// router.post("/", validate(createWorkspaceSchema), createWorkspace);

// router.patch(
//   "/:id",
//   requireWorkspaceRole("admin"),
//   validate(updateWorkspaceSchema),
//   updateWorkspace,
// );

// router.delete("/:id", requireWorkspaceRole("owner"), deleteWorkspace);

// router.get("/:id/members", requireWorkspaceRole("viewer"), getMembers);

// router.post(
//   "/:id/invite",
//   requireWorkspaceRole("admin"),
//   validate(inviteMemberSchema),
//   inviteMember,
// );

// router.patch(
//   "/:id/members/:userId/role",
//   requireWorkspaceRole("admin"),
//   validate(changeMemberRoleSchema),
//   changeMemberRole,
// );

// router.delete(
//   "/:id/members/:userId",
//   requireWorkspaceRole("admin"),
//   removeMember,
// );
