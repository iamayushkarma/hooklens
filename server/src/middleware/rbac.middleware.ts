import { Request, Response, NextFunction } from "express";
import {
  WorkspaceMember,
  WorkspaceRole,
} from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";

const roleRank: Record<WorkspaceRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

export const requiredWorkspaceRole = (minimumRole: WorkspaceRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const workspaceId = req.params.id;
      const userId = req.user!.userId;

      const membership = await WorkspaceMember.findOne({ workspaceId, userId });

      if (!membership) {
        return res
          .status(403)
          .json(
            new ApiResponse(
              403,
              null,
              "You are not a member of this workspace",
            ),
          );
      }

      if (roleRank[membership.role] < roleRank[minimumRole]) {
        return res
          .status(403)
          .json(
            new ApiResponse(403, null, `Requires ${minimumRole} role or above`),
          );
      }

      // Attach role to request so controller can use it without re-querying
      req.workspaceRole = membership.role;
      next();
    } catch (err) {
      next(err);
    }
  };
};
