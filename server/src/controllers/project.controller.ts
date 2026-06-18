import { Request, Response } from "express";
import { Project } from "../models/project.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { Endpoint } from "../models/endpoint.model";
import { RequestLog } from "../models/requestLog.model";

// GET all projects inside a workspace
const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const {
    workspaceId,
    page = 1,
    limit = 10,
  } = req.query as {
    workspaceId: string;
    page?: string;
    limit?: string;
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [projects, total] = await Promise.all([
    Project.find({
      workspaceId,
    })
      .sort({
        updatedAt: -1,
      })
      .skip(skip)
      .limit(Number(limit))
      .lean(),

    Project.countDocuments({
      workspaceId,
    }),
  ]);

  const enrichedProjects = await Promise.all(
    projects.map(async (project) => {
      const endpoints = await Endpoint.find({
        projectId: project._id,
      })
        .select("_id")
        .lean();

      const endpointIds = endpoints.map((endpoint) => endpoint._id);

      const requestCount = await RequestLog.countDocuments({
        endpointId: {
          $in: endpointIds,
        },
      });

      const latestRequest = await RequestLog.findOne({
        endpointId: {
          $in: endpointIds,
        },
      })
        .sort({
          createdAt: -1,
        })
        .select("createdAt")
        .lean();

      return {
        ...project,
        endpointCount: endpoints.length,
        requestCount,
        lastActivityAt: latestRequest?.createdAt ?? project.updatedAt,
      };
    }),
  );

  return res.json(
    new ApiResponse(
      200,
      {
        projects: enrichedProjects,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
      "Projects fetched successfully",
    ),
  );
});

const createProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const { workspaceId, name, description } = req.body;

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
  const { name, description } = req.body;
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) throw new ApiError(404, "Project Not found");

  const updates: Record<string, any> = {};

  // Validate and add name
  if (name !== undefined) {
    if (typeof req.body.name !== "string" || !req.body.name.trim()) {
      throw new ApiError(400, "Invalid project name");
    }
    updates.name = req.body.name.trim();
  }

  // Validate and add description
  if (description !== undefined) {
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
  const { id } = req.params;
  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Not found");

  await Project.findByIdAndDelete(id);
  res.json(new ApiResponse(200, null, "Project deleted"));
});

export { getProjects, createProject, updateProject, deleteProject };
