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

export const requireWorkspaceBodyRole = (minimumRole: WorkspaceRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { workspaceId } = req.body;
      const userId = req.user!.userId;

      if (!workspaceId) {
        return res
          .status(400)
          .json(new ApiResponse(400, null, "workspaceId is required"));
      }

      const membership = await WorkspaceMember.findOne({
        workspaceId,
        userId,
      });

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

      req.workspaceRole = membership.role;

      next();
    } catch (err) {
      next(err);
    }
  };
};
