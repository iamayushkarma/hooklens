import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { Workspace } from "../models/workspace.model";

// GET all workspaces where the logged-in user is a member, include workspace details, attach the user’s role in each workspace, and send it back.
const getWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  const memberships = await WorkspaceMember.find({ userId }).populate(
    "workspaceId",
  ); // `populate` - Fetch all workspace memberships for the user and include full workspace details instead of only workspaceId

  const workspaces = memberships.map((m: any) => ({
    ...m.workspaceId.toObject(), //Mongoose documents are special objects, toObject() converts them into normal JS objects.
    role: m.role,
  }));

  return res.json(new ApiResponse(200, workspaces, "OK"));
});

// POST creates a new workspace and automatically adds the creator as the owner member.
const createWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { name } = req.body;

  if (!name) throw new ApiError(400, "Name is required");

  const workspace = await Workspace.create({ name, ownerId: userId });

  await WorkspaceMember.create({
    workspaceId: workspace._id,
    userId,
    role: "owner",
  });

  res.status(201).json(new ApiResponse(201, workspace, "Workspace created"));
});

// PATCH updates a workspace name, but ONLY if the logged-in user is an 'owner' or 'admin'.
const updateWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;
  const { name } = req.body;

  // Is user member of this workspace
  const member = await WorkspaceMember.findOne({ workspaceId: id, userId });

  if (!member || !["owner", "admin"].includes(member.role)) {
    throw new ApiError(403, "Not authorized");
  }

  const workspace = await Workspace.findByIdAndUpdate(
    id,
    { name },
    { new: true },
  );

  return res.json(new ApiResponse(200, workspace, "Updated"));
});

// DELETE workspace but ONLY if the logged-in user is the owner.
const deleteWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  const workspace = await Workspace.findById(id);
  if (!workspace) throw new ApiError(404, "Not found");

  if (workspace.ownerId.toString() !== userId)
    throw new ApiError(403, "Only owner can delete");

  await Workspace.findByIdAndDelete(id);
  await WorkspaceMember.deleteMany({ workspaceId: id });

  res.json(new ApiResponse(200, null, "Workspace deleted"));
});

// GET members of a workspa
const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  // Check if current user belongs to this workspace
  const currentMember = await WorkspaceMember.findOne({
    workspaceId: id,
    userId,
  });

  if (!currentMember) {
    throw new ApiError(403, "Access denied");
  }

  const members = await WorkspaceMember.find({ workspaceId: id }).populate(
    "userId",
    "-passwordHash",
  );
  // Clean response structure
  const formattedMembers = members.map((member: any) => ({
    ...member.userId.toObject(),
    role: member.role,
    workspaceId: member.workspaceId,
  }));

  return res.json(new ApiResponse(200, formattedMembers, "Members fetched"));
});

export {
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
};
