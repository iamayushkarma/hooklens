import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { Endpoint } from "../models/endpoint.model";
import { RequestLog } from "../models/requestLog.model";
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

// Helper Functions

const getUserId = (req: Request): string => {
  if (!req.user?.userId) throw new ApiError(401, "Unauthorized");

  return req.user.userId;
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
