import { Request, Response } from "express";
import { randomBytes } from "crypto";
import mongoose from "mongoose";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { ok, created } from "../utils/response";
import { Workspace } from "../models/workspace.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { Invitation } from "../models/Invitation.model";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";
import { sendInvitationEmail } from "../services/email.service";

// GET /api/workspaces
const getWorkspaces = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const userId = req.user.userId;

  const memberships = await WorkspaceMember.find({ userId })
    .sort({ createdAt: -1 })
    .lean();

  if (!memberships.length) return ok(res, []);

  const workspaceIds = memberships.map((m) => m.workspaceId);

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
    memberCount: memberCountMap[ws._id.toString()] ?? 0,
    projectCount: projectCountMap[ws._id.toString()] ?? 0,
  }));

  return ok(res, enriched);
});

// POST /api/workspaces
const createWorkspace = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const userId = req.user.userId;
  const { name } = req.body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // create returns array when used with session
    const [workspace] = await Workspace.create([{ name, ownerId: userId }], {
      session,
    });

    await WorkspaceMember.create(
      [
        {
          workspaceId: workspace._id,
          userId,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
      { session },
    );

    await session.commitTransaction();

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
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

// PATCH /api/workspaces/:id
const updateWorkspace = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  const { name } = req.body;

  const workspace = await Workspace.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true },
  ).lean();

  if (!workspace) throw new ApiError(404, "Workspace not found");

  return ok(res, workspace, "Workspace updated");
});

// DELETE /api/workspaces/:id
const deleteWorkspace = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const userId = req.user.userId;
  const { id } = req.params;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const workspace = await Workspace.findById(id).session(session);

    if (!workspace) throw new ApiError(404, "Workspace not found");

    if (workspace.ownerId.toString() !== userId) {
      throw new ApiError(403, "Only the owner can delete this workspace");
    }

    await Promise.all([
      WorkspaceMember.deleteMany({ workspaceId: id }).session(session),
      Invitation.deleteMany({ workspaceId: id }).session(session),
      Project.deleteMany({ workspaceId: id }).session(session),
      workspace.deleteOne({ session }),
    ]);

    await session.commitTransaction();

    return ok(res, null, "Workspace deleted");
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

// GET /api/workspaces/:id/members
const getMembers = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;

  const workspace = await Workspace.findById(id).select("_id");
  if (!workspace) throw new ApiError(404, "Workspace not found");

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
    user: m.userId,
  }));

  return ok(res, { members: formatted, pendingInvites });
});

// POST /api/workspaces/:id/invite
const inviteMember = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { id } = req.params;
  const { email, role } = req.body;
  const invitedByUserId = req.user.userId;

  const workspace = await Workspace.findById(id).select("_id name");
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const currentUser =
    await User.findById(invitedByUserId).select("email fullName");
  if (currentUser?.email === email) {
    throw new ApiError(400, "You cannot invite yourself");
  }

  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    const alreadyMember = await WorkspaceMember.findOne({
      workspaceId: id,
      userId: existingUser._id,
    });
    if (alreadyMember) throw new ApiError(409, "User is already a member");
  }

  const existingInvite = await Invitation.findOne({
    workspaceId: id,
    email,
    status: "pending",
  });
  if (existingInvite)
    throw new ApiError(409, "Invite already sent to this email");

  // token is stored in DB for lookup but never sent back to client
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const invitation = await Invitation.create({
    workspaceId: id as string,
    invitedByUserId,
    email,
    role,
    token,
    expiresAt,
    status: "pending",
  });
  const inviteLink = `${process.env.CLIENT_URL}/invite/accept/${token}`;

  await sendInvitationEmail({
    to: email,
    inviterName: currentUser?.fullName ?? "HookLens",
    workspaceName: workspace.name ?? "Workspace",
    role,
    inviteLink,
  });
  return created(
    res,
    { invitationId: invitation._id, email, role, expiresAt },
    "Invite sent",
  );
});

// GET /api/workspaces/invite/accept/:token
const acceptInvite = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { token } = req.params;
  const userId = req.user.userId;

  const [user, invitation] = await Promise.all([
    User.findById(userId).select("email"),
    Invitation.findOne({ token }),
  ]);

  if (!user) throw new ApiError(404, "User not found");
  if (!invitation) throw new ApiError(404, "Invalid invite token");

  if (user.email !== invitation.email) {
    throw new ApiError(403, "This invitation was not sent to your account");
  }

  if (invitation.status !== "pending") {
    throw new ApiError(410, `Invite already ${invitation.status}`);
  }

  if (invitation.expiresAt < new Date()) {
    await Invitation.findByIdAndUpdate(invitation._id, { status: "expired" });
    throw new ApiError(410, "Invite has expired");
  }

  const alreadyMember = await WorkspaceMember.findOne({
    workspaceId: invitation.workspaceId,
    userId,
  });
  if (alreadyMember) throw new ApiError(409, "You are already a member");

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const memberExists = await WorkspaceMember.findOne({
      workspaceId: invitation.workspaceId,
      userId,
    }).session(session);

    if (memberExists) {
      throw new ApiError(409, "You are already a member");
    }

    await WorkspaceMember.create(
      [{ workspaceId: invitation.workspaceId, userId, role: invitation.role }],
      { session },
    );

    await Invitation.findByIdAndUpdate(
      invitation._id,
      { status: "accepted" },
      { session },
    );

    const workspace = await Workspace.findById(invitation.workspaceId)
      .select("name")
      .lean();
    await session.commitTransaction();
    return ok(
      res,
      {
        workspaceId: invitation.workspaceId,
        workspaceName: workspace?.name,
        role: invitation.role,
      },
      "Joined workspace successfully",
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

// PATCH /api/workspaces/:id/members/:userId/role
const changeMemberRole = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { id, userId: targetUserId } = req.params;
  const { role } = req.body;
  const requesterId = req.user.userId;

  if (requesterId === targetUserId) {
    throw new ApiError(400, "You cannot change your own role");
  }

  if (role === "owner") {
    throw new ApiError(400, "Use transfer ownership to assign the owner role");
  }

  const targetMember = await WorkspaceMember.findOne({
    workspaceId: id,
    userId: targetUserId,
  });

  if (!targetMember) throw new ApiError(404, "Member not found");

  if (targetMember.role === "owner") {
    throw new ApiError(403, "Cannot change the owner's role");
  }

  targetMember.role = role;
  await targetMember.save();

  return ok(res, { userId: targetUserId, newRole: role }, "Role updated");
});

// DELETE /api/workspaces/:id/members/:userId
const removeMember = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { id, userId: targetUserId } = req.params;
  const requesterId = req.user.userId;

  if (requesterId === targetUserId) {
    throw new ApiError(400, "You cannot remove yourself from the workspace");
  }

  const targetMember = await WorkspaceMember.findOne({
    workspaceId: id,
    userId: targetUserId,
  });

  if (!targetMember) throw new ApiError(404, "Member not found");

  if (targetMember.role === "owner") {
    throw new ApiError(
      403,
      "Cannot remove the owner. Transfer ownership first.",
    );
  }

  await targetMember.deleteOne();

  return ok(res, null, "Member removed");
});

export {
  getWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getMembers,
  inviteMember,
  acceptInvite,
  changeMemberRole,
  removeMember,
};
