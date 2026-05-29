import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { RequestLog } from "../models/requestLog.model";
import { Endpoint } from "../models/endpoint.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";

// Helper Functions
const getUserId = (req: Request): string => {
  if (!req.user?.userId) throw new ApiError(401, "Unauthorized");
  return req.user.userId;
};

const getParam = (req: Request, key: string): string => {
  const val = req.params[key];

  if (!val) throw new ApiError(400, `Missing param: ${key}`);
  return Array.isArray(val) ? val[0] : val;
};

const startOfToday = (): Date => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0); // setUTCHours(hours, minutes, seconds, milliseconds)
  return d;
};

// Returns a date n days ago from now
const daysAgo = (n: number): Date => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// Workspace Analytics

const getWorkspaceAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const workspaceId = getParam(req, "id");

    if (!isValidObjectId(workspaceId))
      throw new ApiError(400, "Invalid workspace ID");

    // Verify user is a member of this workspace
    const member = await WorkspaceMember.findOne({
      workspaceId,
      userId,
    }).lean();
    if (!member) throw new ApiError(403, "Access denied");

    const today = startOfToday();
    const twoWeeksAgo = daysAgo(14);

    // Run all aggregations in paralle much faster than sequential awaits

    const [
      requestsToday,
      methodBreakdown,
      dailyTimeline,
      topEndpoints,
      totalThisWeek,
    ] = await Promise.all([
      // Count request that arrived today
      RequestLog.countDocuments({
        workspaceId,
        createdAt: { $gte: today },
      }),

      // Group: count by HTTP method
      RequestLog.aggregate([
        { $match: { workspaceId, createdAt: { $gte: twoWeeksAgo } } },
        { $group: { _id: "$method", count: { $sum: 1 } } },
        { $project: { _id: 0, method: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ]),

      // Group requests per day for the last 14 days
      RequestLog.aggregate([
        { $match: { workspaceId, createdAt: { $gte: twoWeeksAgo } } },
        {
          $group: {
            // Truncate timestamp to just the date part so all requests
            // from the same day collapse into one group
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: "$_id", count: 1 } },
        { $sort: { date: 1 } },
      ]),

      // Top 5 endpoints by traffic
      // requestCount is a counter cache on Endpoint - no aggregation needed,
      // just a simple sort + limit which hits the index directly
      Endpoint.find({ workspaceId, isActive: true })
        .sort({ requestCount: -1 })
        .limit(5)
        .select("label slug requestCount")
        .lean(),

      // Count requests in the last 7 days
      RequestLog.countDocuments({
        workspaceId,
        createdAt: { $gte: daysAgo(7) },
      }),
    ]);
    res.json(
      new ApiResponse(
        200,
        {
          requestsToday,
          totalThisWeek,
          methodBreakdown,
          dailyTimeline,
          topEndpoints,
        },
        "OK",
      ),
    );
  },
);

export { getWorkspaceAnalytics };
