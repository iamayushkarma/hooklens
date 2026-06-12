import { asyncHandler } from "../utils/async-handler";
import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { User } from "../models/user.model";
import { ApiError } from "../utils/api-error";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt";
import { ApiResponse } from "../utils/api-response";
import { Workspace } from "../models/workspace.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { AUTH_PROVIDER } from "../utils/auth-provider";
import admin from "../config/firebase-admin";

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

export { registerUser, loginUser, getCurrentUser, googleLogin };
