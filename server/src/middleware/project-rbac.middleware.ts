import { Request, Response, NextFunction } from "express";
import { Project } from "../models/project.model";
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

export const requireProjectRole = (minimumRole: WorkspaceRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.id;
      const userId = req.user!.userId;

      const project = await Project.findById(projectId).select("workspaceId");

      if (!project) {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "Project not found"));
      }

      const membership = await WorkspaceMember.findOne({
        workspaceId: project.workspaceId,
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
