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

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = registerSchema.parse(req.body); // using zod register schema to validate req.body

  const existingUser = await User.findOne({ email });

  if (existingUser) throw new ApiError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(
    password,
    Number(process.env.BCRYPT_SALT_ROUNDS),
  ); // `BCRYPT_SALT_ROUNDS` represents bcrypt salt rounds

  const user = await User.create({ fullName, email, passwordHash });

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

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) throw new ApiError(401, "Invalid email or password");

  const token = signToken(user._id.toString());

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        token,
        user: { id: user._id, fullName: user.fullName, email: user.email },
      },
      "User logged in successfully",
    ),
  );
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // req.user is attached by auth middleware
  const user = await User.findById((req as any).user.userId).select(
    "-passwordHash",
  );
  if (!user) throw new ApiError(404, "User not found");

  return res.json(new ApiResponse(200, user, "OK"));
});

export { registerUser, loginUser, getCurrentUser };
