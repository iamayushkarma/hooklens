import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { Workspace } from "../models/workspace.model";
import { ok } from "../utils/response";
import { created } from "../utils/response";
import { Project } from "../models/project.model";

// GET all workspaces where the logged-in user is a member, include workspace details, attach the user’s role in each workspace, and send it back.
const getWorkspaces = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;

  // Find all memberships for this user
  const memberships = await WorkspaceMember.find({ userId }).lean();
  const workspaceIds = memberships.map((m) => m.workspaceId);

  // Fetch all workspaces and member counts in parallel
  const [workspaces, memberCounts, projectCounts] = await Promise.all([
    Workspace.find({ _id: { $in: workspaceIds } }).lean(),
    WorkspaceMember.aggregate([
      { $match: { workspaceId: { $in: workspaceIds } } },
      { $group: { _id: "$workspaceId", count: { $sum: 1 } } },
    ]),
    Project.aggregate([
      { $match: { workspaceId: { $in: workspaceIds } } },
      { $group: { _id: "$workspaceId", count: { $sum: 1 } } },
    ]),
  ]);

  // Build lookup maps
  const memberCountMap = Object.fromEntries(
    memberCounts.map((m) => [m._id.toString(), m.count]),
  );
  const projectCountMap = Object.fromEntries(
    projectCounts.map((p) => [p._id.toString(), p.count]),
  );
  const roleMap = Object.fromEntries(
    memberships.map((m) => [m.workspaceId.toString(), m.role]),
  );

  const enriched = workspaces.map((ws) => ({
    ...ws,
    yourRole: roleMap[ws._id.toString()],
    memberCount: memberCountMap[ws._id.toString()] || 0,
    projectCount: projectCountMap[ws._id.toString()] || 0,
  }));

  return ok(res, enriched);
});

// POST creates a new workspace and automatically adds the creator as the owner member.
const createWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { name } = req.body;

  if (!name) throw new ApiError(400, "Name is required");

  const workspace = await Workspace.create({ name, ownerId: userId });

  // Auto add creator as owner
  await WorkspaceMember.create({
    workspaceId: workspace._id,
    userId,
    role: "owner",
    joinedAt: new Date(),
  });

  return created(
    res,
    {
      ...workspace.toObject(),
      yourRole: "owner",
      memberCount: 1,
      projectCount: 0,
    },
    "Workspace created",
  );
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
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
};
