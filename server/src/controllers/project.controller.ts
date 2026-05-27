import { Request, Response } from "express";
import { Project } from "../models/project.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";

const requireMember = async (workspaceId: string, userId: string) => {
  if (!workspaceId) {
    throw new ApiError(400, "workspaceId is required");
  }
  const member = await WorkspaceMember.findOne({ workspaceId, userId });
  if (!member) throw new ApiError(403, "Not a member of this workspace");
  return member;
};

// GET all projects inside a workspace
const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const { workspaceId } = req.query as { workspaceId: string };

  await requireMember(workspaceId, userId);

  const projects = await Project.find({ workspaceId });

  return res.json(new ApiResponse(200, projects, "OK"));
});

const createProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { workspaceId, name, description } = req.body;

  if (!workspaceId || typeof name !== "string" || !name.trim()) {
    throw new ApiError(400, "workspaceId and valid name required");
  }

  await requireMember(workspaceId, userId);

  const project = await Project.create({
    workspaceId,
    name,
    description,
    createdBy: userId,
  });

  res.status(201).json(new ApiResponse(201, project, "Project created"));
});

// PATCH
const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { name, description } = req.body;
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) throw new ApiError(404, "Not found");

  await requireMember(project.workspaceId.toString(), userId);

  const updates: Record<string, any> = {};

  // Validate and add name
  if (req.body.name !== undefined) {
    if (typeof req.body.name !== "string" || !req.body.name.trim()) {
      throw new ApiError(400, "Invalid project name");
    }
    updates.name = req.body.name.trim();
  }

  // Validate and add description
  if (req.body.description !== undefined) {
    if (typeof req.body.description !== "string") {
      throw new ApiError(400, "Invalid description");
    }

    updates.description = req.body.description.trim();
  }

  // Prevent empty update request
  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "No valid fields provided");
  }

  const updated = await Project.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true, // MongoDB update bypasses schema validators sometimes with `runValidators` schema validation runs properly.
  });

  res.json(new ApiResponse(200, updated, "Updated"));
});

// DELETE
const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Not found");

  const member = await WorkspaceMember.findOne({
    workspaceId: project.workspaceId,
    userId,
  });
  if (!member || !["owner", "admin"].includes(member.role)) {
    throw new ApiError(403, "Not authorized");
  }

  await Project.findByIdAndDelete(id);
  res.json(new ApiResponse(200, null, "Project deleted"));
});

export { getProjects, createProject, updateProject, deleteProject };
