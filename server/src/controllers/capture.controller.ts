import { Request, Response } from "express";
import { Endpoint } from "../models/endpoint.model";
import { RequestLog } from "../models/requestLog.model";
import {
  sanitizeHeaders,
  sanitizeBody,
  sanitizeQuery,
} from "../utils/sanitize";

const ALLOWED_METHODS = new Set([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

// Helper Function

const captureHandler = async (
  req: Request<{ slug: string }>,
  res: Response,
): Promise<void> => {
  res.status(200).json({ received: true });

  try {
    const slug = req.params.slug?.trim();
    const method = req.method.toUpperCase();

    if (!slug || !ALLOWED_METHODS.has(method)) return;

    // Find endpoint - compound index on { slug, isActive } makes this fast
    const endpoint = await Endpoint.findOne({ slug, isActive: true }).lean();

    // Silently drop if endpoint not found or disabled
    // Never 404 - response was already sent and slug enumeration prevented
    if (!endpoint) return;

    // Sanitize everything before storing
    const safeHeaders = sanitizeHeaders(req.headers as Record<string, string>);
    const safeBody = sanitizeBody(req.body);
    const safeQuery = sanitizeQuery(req.query as Record<string, unknown>);
    const rawBody = safeBody ? JSON.stringify(safeBody) : "";
    const size = Buffer.byteLength(rawBody, "utf8");

    // Store the request log
    const requestLog = await RequestLog.create({
      endpointId: endpoint._id,
      workspaceId: endpoint.workspaceId,
      userId: endpoint.userId,
      method,
      headers: safeHeaders,
      body: safeBody,
      rawBody,
      query: safeQuery,
      ip: req.ip ?? "",
      userAgent: (req.headers["user-agent"] ?? "").slice(0, 500), // cap length
      contentType: (req.headers["content-type"] ?? "").slice(0, 200),
      size,
    });
    // Increment counter - fire and forget, don't await
    Endpoint.findByIdAndUpdate(endpoint._id, {
      $inc: { requestCount: 1 },
    }).exec();

    // Push live to dashboard — only if socket is ready
    // Wrapped in try so a socket error never breaks capture
    try {
      const { io } = await import("../socket");
      if (io) {
        io.to(`endpoint:${slug}`).emit("request:new", { request: requestLog });
      }
    } catch {
      // Socket not initialized yet — fine, capture still works
    }
  } catch (err) {
    // Never let a DB or processing error surface to the webhook sender
    // They already got 200 OK — log internally only
    console.error("[CaptureHandler]", err);
  }
};
