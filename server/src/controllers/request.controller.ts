import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { RequestLog } from "../models/requestLog.model";
import { Endpoint } from "../models/endpoint.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { replayRequest } from "../utils/replay";
import { explainPayload } from "../utils/groq";
import { emitRequestDeleted } from "../socket/events";

// Helpers
const toPlainObject = (val: unknown): Record<string, string> => {
  if (!val) return {};
  if (val instanceof Map) return Object.fromEntries(val);
  if (typeof val === "object") return val as Record<string, string>;
  return {};
};

const getUserId = (req: Request): string => {
  if (!req.user?.userId) throw new ApiError(401, "Unauthorized");
  return req.user.userId;
};

const getParam = (req: Request, key: string): string => {
  const val = req.params[key];
  if (!val) throw new ApiError(400, `Missing param: ${key}`);
  return Array.isArray(val) ? val[0] : val;
};

// Shared lookup gets request log and verifies workspace membership
const getRequestWithAccess = async (requestId: string, userId: string) => {
  if (!isValidObjectId(requestId))
    throw new ApiError(400, "Invalid request ID");

  const requestLog = await RequestLog.findById(requestId).lean();
  if (!requestLog) throw new ApiError(404, "Request not found");

  const member = await WorkspaceMember.findOne({
    workspaceId: requestLog.workspaceId,
    userId,
  }).lean();
  if (!member) throw new ApiError(403, "Access denied");

  return requestLog;
};

//  Controllers
const getRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const requestId = getParam(req, "id");

  const requestLog = await getRequestWithAccess(requestId, userId);

  res.json(new ApiResponse(200, requestLog, "OK"));
});

const deleteRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const requestId = getParam(req, "id");

  const requestLog = await getRequestWithAccess(requestId, userId);
  const endpoint = await Endpoint.findById(requestLog.endpointId).lean();

  await RequestLog.findByIdAndDelete(requestId);

  if (endpoint) emitRequestDeleted(endpoint.slug, requestId);

  res.json(new ApiResponse(200, null, "Request deleted"));
});

const replayRequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const requestId = getParam(req, "id");

    const { targetUrl } = req.body;
    if (!targetUrl || typeof targetUrl !== "string") {
      throw new ApiError(400, "targetUrl is required");
    }

    const requestLog = await getRequestWithAccess(requestId, userId);

    const result = await replayRequest(
      requestLog.method,
      toPlainObject(requestLog.headers), // ← fix
      requestLog.body,
      targetUrl,
    );

    res.json(
      new ApiResponse(
        200,
        {
          original: {
            method: requestLog.method,
            headers: toPlainObject(requestLog.headers), // ← fix
            body: requestLog.body,
          },
          replay: result,
        },
        "Replay complete",
      ),
    );
  },
);

const explainRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const requestId = getParam(req, "id");

  const requestLog = await getRequestWithAccess(requestId, userId);

  const explanation = await explainPayload(
    requestLog.method,
    toPlainObject(requestLog.headers),
    requestLog.body,
  );

  res.json(new ApiResponse(200, { explanation }, "OK"));
});
const getProjectRequests = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req);

  const projectId = getParam(req, "projectId");

  const endpoints = await Endpoint.find({
    projectId,
  }).lean();

  const endpointIds = endpoints.map((endpoint) => endpoint._id);

  const requests = await RequestLog.find({
    endpointId: {
      $in: endpointIds,
    },
  })
    .sort({
      createdAt: -1,
    })
    .limit(500)
    .lean();

  res.json(new ApiResponse(200, requests, "Project requests fetched"));
});
export {
  getRequest,
  deleteRequest,
  replayRequestHandler,
  explainRequest,
  getProjectRequests,
};
