import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Endpoint } from "../models/endpoint.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import {
  createEndpointSchema,
  updateEndpointSchema,
} from "../validators/endpoint.validator";
import { isValidObjectId } from "mongoose";
import { Project } from "../models/project.model";
import { RequestLog } from "../models/requestLog.model";

// Helper Functions

const getUserId = (req: Request): string => {
  if (!req.user?.userId) throw new ApiError(401, "Unauthorized");

  return req.user.userId;
};

const getParam = (req: Request, key: string): string => {
  const val = req.params[key];
  if (!val) throw new ApiError(400, `Missing route param: ${key}`);
  return Array.isArray(val) ? val[0] : val;
};

const validateObjectId = (id: string, label = "ID") => {
  if (!isValidObjectId(id)) throw new ApiError(400, `Invalid ${label} format`);
};

const requireMember = async (workspaceId: string, userId: string) => {
  const member = await WorkspaceMember.findOne({ workspaceId, userId }).lean();
  if (!member) throw new ApiError(403, "Access denied");
  return member;
};

const requireEndpointAccess = async (endpointId: string, userId: string) => {
  validateObjectId(endpointId, "endpointId");
  const endpoint = await Endpoint.findById(endpointId).lean();
  if (!endpoint) throw new ApiError(404, "Endpoint not found");
  await requireMember(endpoint.workspaceId.toString(), userId);
  return endpoint;
};

// Controllers

// GET
const getEndpoint = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const projectId = (req.query.projectId as string) ?? "";

  if (!projectId) throw new ApiError(400, "projectId is required");
  validateObjectId(projectId, "projectId");

  // Verify user belongs to this project's workspace via endpoint lookup
  const project = await Project.findById(projectId).lean();
  if (!project) throw new ApiError(404, "Project not found");

  await requireMember(project.workspaceId.toString(), userId);

  const endpoints = await Endpoint.find({ projectId })
    .sort({ createdAt: -1 })
    .lean();

  res.json(new ApiResponse(200, endpoints, "OK"));
});

// POST
const createEndpoint = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { projectId, workspaceId, label } = createEndpointSchema.parse(
    req.body,
  );

  // Verify project exists and actually belongs to the given workspace
  // Prevents cross-workspace endpoint injection
  const project = await Project.findById(projectId).lean();

  if (!project) throw new ApiError(404, "Project not found");
  if (project.workspaceId.toString() !== workspaceId) {
    throw new ApiError(400, "Project does not belong to this workspace");
  }

  await requireMember(workspaceId, userId);

  // Generating slug with collision retry
  // nanoid(8) = 64^8 = ~281 trillion combinations, collision is near impossible
  // but handled it properly anyway
  let slug = nanoid(8);
  const collision = await Endpoint.exists({ slug });
  if (collision) slug = nanoid(12); // fallback to longer

  const endpoint = await Endpoint.create({
    projectId,
    workspaceId,
    userId,
    slug,
    label,
  });

  res.status(201).json(new ApiResponse(201, endpoint, "Endpoint created"));
});

// PATCH
const updateEndpoint = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const endpointId = getParam(req, "id");
  const endpoint = await requireEndpointAccess(endpointId, userId);
  const updates = updateEndpointSchema.parse(req.body);

  const updated = await Endpoint.findByIdAndUpdate(
    endpoint._id,
    { $set: updates }, // explicit $set - never allow arbitrary field updates
    { new: true, runValidators: true },
  ).lean();

  res.json(new ApiResponse(200, updated, "Endpoint updated"));
});

// DELETE
const deleteEndpoint = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const endpointId = getParam(req, "id");
  const endpoint = await requireEndpointAccess(endpointId, userId);

  // Re fetch membership with workspaceId from endpoint (not from request body)
  // Using endpoint.workspaceId ensures correct workspace scope
  const member = await WorkspaceMember.findOne({
    workspaceId: endpoint.workspaceId,
    userId,
  }).lean();

  if (!member || !["owner", "admin"].includes(member.role)) {
    throw new ApiError(403, "Only owner or admin can delete endpoints");
  }

  // Delete endpoint + all its logs in parallel
  await Promise.all([
    Endpoint.findByIdAndDelete(endpoint._id),
    RequestLog.deleteMany({ endpointId: endpoint._id }),
  ]);
});

const getEndpointRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const endpointId = getParam(req, "id");
    await requireEndpointAccess(endpointId, userId);

    // Clamp pagination never let client request unlimited records
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 20),
    );
    const skip = (page - 1) * limit;

    // Run both queries in parallel faster than sequential awaits
    const [requests, total] = await Promise.all([
      RequestLog.find({ endpointId: req.params.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RequestLog.countDocuments({ endpointId: req.params.id }),
    ]);

    res.json(
      new ApiResponse(
        200,
        {
          requests,
          pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
          },
        },
        "OK",
      ),
    );
  },
);
export {
  getEndpoint,
  createEndpoint,
  updateEndpoint,
  deleteEndpoint,
  getEndpointRequests,
};
