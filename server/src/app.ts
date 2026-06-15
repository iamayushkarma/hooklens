import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRouter from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import projectRoutes from "./routes/project.routes";
import endpointRoutes from "./routes/endpoint.routes";
import analyticsRoutes from "./routes/analytics.routes";
import { captureHandler } from "./controllers/capture.controller";
import {
  captureRateLimit,
  authRateLimit,
} from "./middleware/rateLimit.middleware";
import requestRoutes from "./routes/request.routes";

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") }));
app.use(express.json({ limit: "200kb" })); // cap incoming body size
app.use(express.urlencoded({ extended: true, limit: "200kb" }));

// Health Check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Capture Route (PUBLIC - must be before auth middleware)
// Accepts ANY HTTP method, no auth, always returns 200
app.all("/h/:slug", captureRateLimit, captureHandler);

// API Routes
app.use("/api/v1/auth", authRateLimit, authRouter);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/endpoints", endpointRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/requests", requestRoutes);

export default app;
