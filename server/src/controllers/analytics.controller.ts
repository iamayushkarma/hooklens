import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { RequestLog } from "../models/requestLog.model";
import { Endpoint } from "../models/endpoint.model";
import { WorkspaceMember } from "../models/workspaceMember.model";
import { ApiResponse } from "../utils/api-response";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import mongoose from "mongoose";
import { ReplayLog } from "../models/replayLog.model";

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

    const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId);
    // Verify user is a member of this workspace
    const member = await WorkspaceMember.findOne({
      workspaceId,
      userId,
    }).lean();
    if (!member) throw new ApiError(403, "Access denied");

    const today = startOfToday();
    const yesterday = daysAgo(1);
    const twoMonthsAgo = daysAgo(60);
    const oneWeekAgo = daysAgo(7);
    const twoWeeksAgo = daysAgo(14);
    const thirtyDaysAgo = daysAgo(30);
    const sixtyDaysAgoForReplays = daysAgo(60);

    const [
      requestsToday,
      requestsYesterday,
      methodBreakdown,
      dailyTimeline,
      topEndpoints,
      totalThisWeek,
      totalLastWeek,
      activeEndpointCount,
      totalEndpointCount,
      replaysLast30Days,
      replaysPrev30Days,
    ] = await Promise.all([
      // Count requests that arrived today
      RequestLog.countDocuments({
        workspaceId,
        createdAt: { $gte: today },
      }),

      // Count requests that arrived yesterday (for day-over-day delta)
      RequestLog.countDocuments({
        workspaceId,
        createdAt: { $gte: yesterday, $lt: today },
      }),

      // HTTP method breakdown
      RequestLog.aggregate([
        {
          $match: {
            workspaceId: workspaceObjectId,
            createdAt: { $gte: twoMonthsAgo },
          },
        },
        { $group: { _id: "$method", count: { $sum: 1 } } },
        { $project: { _id: 0, method: "$_id", count: 1 } },
        { $sort: { count: -1 } },
      ]),

      // Requests per day (last 60 days, filtered client-side by timeRange)
      RequestLog.aggregate([
        {
          $match: {
            workspaceId: workspaceObjectId,
            createdAt: { $gte: twoMonthsAgo },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, date: "$_id", count: 1 } },
        { $sort: { date: 1 } },
      ]),

      // Top endpoints
      Endpoint.find({ workspaceId, isActive: true })
        .sort({ requestCount: -1 })
        .limit(5)
        .select("label slug requestCount")
        .lean(),

      // Requests in last 7 days
      RequestLog.countDocuments({
        workspaceId,
        createdAt: { $gte: oneWeekAgo },
      }),

      // Requests in the 7 days before that — powers the "This week" delta
      RequestLog.countDocuments({
        workspaceId,
        createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
      }),

      // Active endpoint count — used by the stat card, not just the top-5 list
      Endpoint.countDocuments({ workspaceId, isActive: true }),

      // Total endpoint count (active + inactive) — used to show "3 inactive"
      Endpoint.countDocuments({ workspaceId }),

      // Replays run in the last 30 days
      ReplayLog.countDocuments({
        workspaceId,
        createdAt: { $gte: thirtyDaysAgo },
      }),

      // Replays run in the 30 days before that — powers the replays delta
      ReplayLog.countDocuments({
        workspaceId,
        createdAt: { $gte: sixtyDaysAgoForReplays, $lt: thirtyDaysAgo },
      }),
    ]);

    const requestsDeltaPct =
      requestsYesterday === 0
        ? null
        : Math.round(
            ((requestsToday - requestsYesterday) / requestsYesterday) * 100,
          );

    const weekDeltaPct =
      totalLastWeek === 0
        ? null
        : Math.round(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100);

    const replaysDeltaPct =
      replaysPrev30Days === 0
        ? null
        : Math.round(
            ((replaysLast30Days - replaysPrev30Days) / replaysPrev30Days) * 100,
          );

    res.json(
      new ApiResponse(
        200,
        {
          requestsToday,
          requestsYesterday,
          requestsDeltaPct,
          totalThisWeek,
          totalLastWeek,
          weekDeltaPct,
          activeEndpointCount,
          totalEndpointCount,
          replaysLast30Days,
          replaysDeltaPct,
          methodBreakdown,
          dailyTimeline,
          topEndpoints,
        },
        "OK",
      ),
    );
  },
);

const getEndpointAnalytics = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = getUserId(req);
    const endpointId = getParam(req, "id");

    if (!isValidObjectId(endpointId))
      throw new ApiError(400, "Invalid endpoint ID");

    // Get endpoint and verify workspace access in one step
    const endpoint = await Endpoint.findById(endpointId).lean();
    if (!endpoint) throw new ApiError(404, "Endpoint not found");

    const member = await WorkspaceMember.findOne({
      workspaceId: endpoint.workspaceId,
      userId,
    }).lean();
    if (!member) throw new ApiError(403, "Access denied");

    const today = startOfToday();
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [requestsToday, methodBreakdown, hourlyTimeline, totalRequests] =
      await Promise.all([
        // Count: today's requests for this endpoint ───────────────────────────
        RequestLog.countDocuments({
          endpointId,
          createdAt: { $gte: today },
        }),

        // Group: method breakdown for this endpoint ───────────────────────────
        RequestLog.aggregate([
          { $match: { endpointId: endpoint._id } },
          { $group: { _id: "$method", count: { $sum: 1 } } },
          { $project: { _id: 0, method: "$_id", count: 1 } },
          { $sort: { count: -1 } },
        ]),

        // Group: requests per hour for the last 24 hours
        // More granular than daily — shows traffic spikes within a day
        RequestLog.aggregate([
          {
            $match: {
              endpointId: endpoint._id,
              createdAt: { $gte: last24Hours },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%dT%H:00",
                  date: "$createdAt",
                },
              },
              count: { $sum: 1 },
            },
          },
          { $project: { _id: 0, hour: "$_id", count: 1 } },
          { $sort: { hour: 1 } },
        ]),

        // requestCount on the model is a live counter — no aggregation needed
        Promise.resolve(endpoint.requestCount),
      ]);

    res.json(
      new ApiResponse(
        200,
        {
          totalRequests,
          requestsToday,
          methodBreakdown,
          hourlyTimeline,
          endpoint: {
            label: endpoint.label,
            slug: endpoint.slug,
            isActive: endpoint.isActive,
          },
        },
        "OK",
      ),
    );
  },
);
export { getWorkspaceAnalytics, getEndpointAnalytics };
