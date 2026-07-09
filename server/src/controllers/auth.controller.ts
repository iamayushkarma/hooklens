import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import {
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validators/auth.validator";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api-error";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { ApiResponse } from "../utils/api-response";
import { Workspace } from "../models/workspace.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { AUTH_PROVIDER } from "../utils/auth-provider";
import admin from "../config/firebase-admin";
import mongoose from "mongoose";
import { Notification } from "../models/notification.model";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = registerSchema.parse(req.body); // using zod register schema to validate req.body

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new ApiError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS),
  ); // `BCRYPT_SALT_ROUNDS` represents bcrypt salt rounds

  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${email}`;

  const user = await User.create({
    fullName,
    email,
    passwordHash,
    authProvider: AUTH_PROVIDER.LOCAL,
    avatarUrl,
  });

  const token = signToken(user._id.toString());

  // Auto-create workspace on user registration
  const workspace = await Workspace.create({
    name: `${fullName}'s Workspace`,
    ownerId: user._id,
  });
  await WorkspaceMember.create({
    workspaceId: workspace._id,
    userId: user._id,
    role: "owner",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { token, user: { id: user._id, fullName, email } },
        "User registered successfully",
      ),
    );
});

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid email or password");

  if (!user.passwordHash) {
    throw new ApiError(401, "Invalid email or password");
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");
  if (user.authProvider === AUTH_PROVIDER.GOOGLE) {
    throw new ApiError(
      400,
      "This account uses Google Sign-In. Please continue with Google.",
    );
  }

  const token = signToken(user._id.toString());

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      },
      "User logged in successfully",
    ),
  );
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // req.user is attached by auth middleware
  const user = await User.findById((req as any).user.userId).select(
    "-passwordHash -googleId",
  );
  if (!user) throw new ApiError(404, "User not found");

  return res.json(new ApiResponse(200, user, "OK"));
});

const googleLogin = asyncHandler(async (req: Request, res: Response) => {
  const { idToken } = req.body;

  if (!idToken) {
    throw new ApiError(400, "Google token is required");
  }

  const decodedToken = await admin.auth().verifyIdToken(idToken);

  const { uid, email, name, picture } = decodedToken;

  if (!email) {
    throw new ApiError(400, "Google account email not found");
  }

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      fullName: name,
      email,
      googleId: uid,
      authProvider: AUTH_PROVIDER.GOOGLE,
      avatarUrl: picture,
    });

    // Create default workspace
    const workspace = await Workspace.create({
      name: `${name}'s Workspace`,
      ownerId: user._id,
    });
    await WorkspaceMember.create({
      workspaceId: workspace._id,
      userId: user._id,
      role: "owner",
    });
  }
  const token = signToken(user._id.toString());

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
      },
      "Google login successful",
    ),
  );
});
// PATCH /api/v1/auth/me
const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { fullName, avatarUrl } = updateProfileSchema.parse(req.body);

  const update: { fullName: string; avatarUrl?: string } = { fullName };
  if (avatarUrl) update.avatarUrl = avatarUrl;

  const user = await User.findByIdAndUpdate(req.user.userId, update, {
    new: true,
    runValidators: true,
  }).select("-passwordHash -googleId");

  if (!user) throw new ApiError(404, "User not found");

  return res.json(new ApiResponse(200, user, "Profile updated successfully"));
});

// PATCH /api/v1/auth/me/password
const changePassword = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

  const user = await User.findById(req.user.userId);
  if (!user) throw new ApiError(404, "User not found");

  if (user.authProvider === AUTH_PROVIDER.GOOGLE || !user.passwordHash) {
    throw new ApiError(
      400,
      "This account uses Google Sign-In and doesn't have a password to change",
    );
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash,
  );
  if (!isCurrentPasswordValid) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.passwordHash = await bcrypt.hash(
    newPassword,
    Number(process.env.BCRYPT_SALT_ROUNDS),
  );
  await user.save();

  return res.json(new ApiResponse(200, null, "Password updated successfully"));
});

// DELETE /api/v1/auth/me
const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const userId = req.user.userId;

  const ownedWorkspaceCount = await Workspace.countDocuments({
    ownerId: userId,
  });

  if (ownedWorkspaceCount > 0) {
    throw new ApiError(
      400,
      "You own one or more workspaces. Transfer ownership or delete them before deleting your account.",
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await Promise.all([
      WorkspaceMember.deleteMany({ userId }).session(session),
      Notification.deleteMany({ userId }).session(session),
      User.findByIdAndDelete(userId).session(session),
    ]);

    await session.commitTransaction();

    return res.json(new ApiResponse(200, null, "Account deleted successfully"));
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});
export {
  registerUser,
  loginUser,
  getCurrentUser,
  googleLogin,
  changePassword,
  deleteAccount,
  updateProfile,
};
