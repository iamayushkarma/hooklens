import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { Endpoint } from "../models/endpoint.model";
import { WorkspaceMember } from "../models/workspaceMember.model";

const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};
const JWT_SECRET = getEnvOrThrow("JWT_SECRET");

//- Event Type Interfaces
export interface ServerToClientEvents {
  "request:new": (data: { request: unknown }) => void;
  "request:deleted": (data: { requestId: string }) => void;
  "endpoint:disabled": (data: { slug: string }) => void;
  // Explicit error channel, client always knows why something failed
  "socket:error": (data: { event: string; message: string }) => void;
}

export interface ClientToServerEvents {
  "inspect:join": (slug: string) => void;
  "inspect:leave": (slug: string) => void;
}

interface SocketData {
  userId: string;
}

type AppSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

// Room name helper
export const getRoomName = (slug: string): string => `endpoint:${slug}`;

// Slug Normalization
const normalizeSlug = (raw: unknown): string | null => {
  if (typeof raw !== "string") return null;
  const slug = raw.trim().toLowerCase();
  // Rejecting empty, too long, or slugs with illegal characters
  if (!slug || slug.length > 64 || !/^[a-z0-9_-]+$/.test(slug)) return null;
  return slug;
};

//! Development Only
// Structured Logger
// JSON format so logs are parseable by tools like Datadog, Papertrail, etc.
// Avoids scattered console.log strings that are impossible to query.
const log = {
  info: (event: string, ctx: Record<string, unknown>) =>
    console.log(
      JSON.stringify({
        level: "info",
        event,
        ...ctx,
        ts: new Date().toISOString(),
      }),
    ),
  warn: (event: string, ctx: Record<string, unknown>) =>
    console.warn(
      JSON.stringify({
        level: "warn",
        event,
        ...ctx,
        ts: new Date().toISOString(),
      }),
    ),
  error: (event: string, ctx: Record<string, unknown>) =>
    console.error(
      JSON.stringify({
        level: "error",
        event,
        ...ctx,
        ts: new Date().toISOString(),
      }),
    ),
};

// RBAC: Allowed Roles for Live Feed
// All workspace members (including viewers) can watch the live feed.
// This matches the REST API access model - consistent across the entire app.
const LIVE_FEED_ROLES = new Set(["owner", "admin", "member", "viewer"]);

//  TTL Access Cache
// Caches access check results for 30 seconds per (userId + slug) pair.
// Without this, every inspect:join fires 2 DB queries.
// Trade-off: role changes take up to 30s to reflect — acceptable for live feed.
interface CacheEntry {
  allowed: boolean;
  reason?: string;
  expiresAt: number;
}

class AccessCache {
  private cache = new Map<string, CacheEntry>();
  private readonly TTL_MS = 30_000; // Time in miliseconds

  private key(userId: string, slug: string): string {
    return `${userId}:${slug}`;
  }

  get(userId: string, slug: string): CacheEntry | null {
    const entry = this.cache.get(this.key(userId, slug));
    if (!entry) return null;
    // Expired - remove and return null so caller re-fetches
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(this.key(userId, slug));
      return null;
    }
    return entry;
  }

  set(userId: string, slug: string, allowed: boolean, reason?: string): void {
    this.cache.set(this.key(userId, slug), {
      allowed,
      reason,
      expiresAt: Date.now() + this.TTL_MS,
    });
  }

  // Call on endpoint update/disable to invalidate stale entries
  invalidate(slug: string): void {
    for (const key of this.cache.keys()) {
      if (key.endsWith(`:${slug}`)) this.cache.delete(key);
    }
  }
}

const accessCache = new AccessCache();

export const canAccessEndpointBySlug = async (
  slug: string,
  userId: string,
): Promise<{ allowed: boolean; reason?: string }> => {
  // Check cache first, avoid hitting DB on every event
  const cached = accessCache.get(userId, slug);
  if (cached) return { allowed: cached.allowed, reason: cached.reason };

  // Fetch only the fields we need don't pull entire documents
  const endpoint = await Endpoint.findOne({ slug, isActive: true })
    .select("workspaceId isActive")
    .lean();

  if (!endpoint) {
    const result = { allowed: false, reason: "Endpoint not found or inactive" };
    accessCache.set(userId, slug, false, result.reason);
    return result;
  }

  const member = await WorkspaceMember.findOne({
    workspaceId: endpoint.workspaceId,
    userId,
  })
    .select("role")
    .lean();

  if (!member || !LIVE_FEED_ROLES.has(member.role)) {
    const result = { allowed: false, reason: "Not a workspace member" };
    accessCache.set(userId, slug, false, result.reason);
    return result;
  }

  accessCache.set(userId, slug, true);
  return { allowed: true };
};

// Per-Socket Rate Limiter
class SocketRateLimiter {
  private readonly counts = new Map<
    string,
    { count: number; resetAt: number }
  >();
  private readonly MAX: number;
  private readonly WINDOW: number;

  constructor(maxEvents = 15, windowMs = 60_000) {
    this.MAX = maxEvents;
    this.WINDOW = windowMs;
  }

  isAllowed(socketId: string): boolean {
    const now = Date.now();
    const record = this.counts.get(socketId);

    if (!record || now > record.resetAt) {
      this.counts.set(socketId, { count: 1, resetAt: now + this.WINDOW });
      return true;
    }

    if (record.count >= this.MAX) return false;
    record.count++;
    return true;
  }

  // Always clean up on disconnect - prevent memory leak on long-running server
  clear(socketId: string): void {
    this.counts.delete(socketId);
  }
}

const joinLimiter = new SocketRateLimiter(15, 60_000); // 15 joins per minute per socket

export let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  Record<string, never>,
  SocketData
>;

interface TokenPayload {
  userId: string;
}

// Extend socket to carry userId after auth
interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
  };
}
export const setupSocket = (server: http.Server): void => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Keeps WebSocket alive through Render.com's 55s idle timeout
    pingInterval: 25_000,
    pingTimeout: 60_000,
  });

  //JWT Auth Middleware
  // Runs once per connection before any events.
  // Unauthenticated sockets are rejected here — never reach event handlers.
  io.use((socket: AppSocket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token || typeof token !== "string") {
      return next(new Error("Authentication token required"));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      socket.data.userId = decoded.userId;
      next();
    } catch {
      // Don't leak whether token is expired vs invalid — same error for both
      next(new Error("Invalid or expired token"));
    }
  });

  // Connection
  io.on("connection", (socket: AppSocket) => {
    const { userId } = socket.data;

    log.info("socket:connected", { socketId: socket.id, userId });

    // inspect:join
    socket.on("inspect:join", async (rawSlug) => {
      // 1. Rate limit — reject spam before any DB work
      if (!joinLimiter.isAllowed(socket.id)) {
        socket.emit("socket:error", {
          event: "inspect:join",
          message: "Too many join requests. Wait a moment.",
        });
        log.warn("socket:join:ratelimited", { socketId: socket.id, userId });
        return;
      }

      // 2. Normalize and validate slug format
      const slug = normalizeSlug(rawSlug);
      if (!slug) {
        socket.emit("socket:error", {
          event: "inspect:join",
          message: "Invalid endpoint slug",
        });
        return;
      }

      const room = getRoomName(slug);

      // 3. Duplicate join prevention — joining the same room twice is a no-op
      //    but we skip the DB query entirely if already joined
      if (socket.rooms.has(room)) return;

      // 4. RBAC check — workspace membership, not owner-only
      try {
        const { allowed, reason } = await canAccessEndpointBySlug(slug, userId);

        if (!allowed) {
          socket.emit("socket:error", {
            event: "inspect:join",
            message: reason ?? "Access denied",
          });
          log.warn("socket:join:denied", {
            socketId: socket.id,
            userId,
            slug,
            reason,
          });
          return;
        }

        socket.join(room);
        log.info("socket:join:success", {
          socketId: socket.id,
          userId,
          slug,
          room,
        });
      } catch (err) {
        // Something failed in DB — tell client to retry, log full error server-side
        socket.emit("socket:error", {
          event: "inspect:join",
          message: "Could not join room. Please try again.",
        });
        log.error("socket:join:exception", {
          socketId: socket.id,
          userId,
          slug,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    });

    // inspect:leave
    socket.on("inspect:leave", (rawSlug) => {
      const slug = normalizeSlug(rawSlug);
      if (!slug) return;

      const room = getRoomName(slug);

      // Only leave if actually in the room — avoids pointless socket.leave calls
      if (!socket.rooms.has(room)) return;

      socket.leave(room);
      log.info("socket:leave", { socketId: socket.id, userId, slug });
    });

    // disconnect
    socket.on("disconnect", (reason) => {
      // Always clean up rate limiter to prevent memory leak
      joinLimiter.clear(socket.id);

      // Socket.io auto-removes socket from all rooms on disconnect
      // We only log unexpected disconnects — not normal client closes
      if (reason !== "client namespace disconnect") {
        log.info("socket:disconnected", {
          socketId: socket.id,
          userId,
          reason,
        });
      }
    });

    socket.on("error", (err) => {
      log.error("socket:error", {
        socketId: socket.id,
        userId,
        message: err.message,
      });
    });
  });
};

// Export cache invalidation so other parts of the app can use it
// e.g. when an endpoint is disabled, call this to clear stale cache entries
export const invalidateAccessCache = (slug: string): void => {
  accessCache.invalidate(slug);
};
