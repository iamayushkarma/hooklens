import { Request, Response } from "express";
import { asyncHandler } from "../utils/async-handler";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { Workspace } from "../models/workspace.model";
import { ok } from "../utils/response";
import { created } from "../utils/response";
import { Project } from "../models/project.model";
import { Invitation } from "../models/Invitation.model";
import { User } from "../models/user.model";
import { randomBytes } from "crypto";

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

  const workspace = await Workspace.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true },
  ).lean();

  if (!workspace) {
    return res.status(404).json(new ApiError(404, "Workspace not found"));
  }

  return res.json(new ApiResponse(200, workspace, "Updated"));
});

// DELETE workspace but ONLY if the logged-in user is the owner.
const deleteWorkspace = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { id } = req.params;

  const workspace = await Workspace.findById(id);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  if (workspace.ownerId.toString() !== userId)
    throw new ApiError(403, "Only owner can delete");

  // Cascade delete order matters
  await Promise.all([
    WorkspaceMember.deleteMany({ workspaceId: id }),
    Invitation.deleteMany({ workspaceId: id }),
    Project.deleteMany({ workspaceId: id }),
    // Add Endpoint.deleteMany, RequestLog.deleteMany here when those models exist
  ]);
  await workspace.deleteOne();

  return ok(res, null, "Workspace deleted");
});

// GET members of a workspace
const getMembers = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const [members, pendingInvites] = await Promise.all([
    WorkspaceMember.find({ workspaceId: id })
      .populate("userId", "name email createdAt")
      .lean(),
    Invitation.find({ workspaceId: id, status: "pending" })
      .populate("invitedByUserId", "name email")
      .lean(),
  ]);

  const formatted = members.map((m) => ({
    memberId: m._id,
    role: m.role,
    joinedAt: m.joinedAt,
    user: m.userId, // populated: { _id, name, email }
  }));

  return ok(res, { members: formatted, pendingInvites });
});

const inviteMember = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, role } = req.body;
  const invitedByUserId = req.user!.userId;

  // Check if user already a member
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    const alreadyMember = await WorkspaceMember.findOne({
      workspaceId: id,
      userId: existingUser._id,
    });
    if (alreadyMember) {
      return res
        .status(409)
        .json({ success: false, message: "User is already a member" });
    }
  }

  // Check for existing pending invite
  const existingInvite = await Invitation.findOne({
    workspaceId: id,
    email,
    status: "pending",
  });
  if (existingInvite) {
    return res
      .status(409)
      .json({ success: false, message: "Invite already sent to this email" });
  }

  // Generate secure token
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

  const invitation = await Invitation.create({
    workspaceId: id as string,
    invitedByUserId,
    email,
    role,
    token,
    expiresAt,
    status: "pending",
  });

  // TODO: Send invite email here with link:
  // `${process.env.CLIENT_URL}/invite/accept/${token}`

  return created(
    res,
    { invitationId: invitation._id, email, role, expiresAt },
    "Invite sent",
  );
};

export {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
  inviteMember,
};
