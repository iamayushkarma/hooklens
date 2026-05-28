import mongoose, { Document, Schema } from "mongoose";

export interface IRequestLog extends Document {
  endpointId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  method: string;
  headers: Map<string, string>;
  body: unknown;
  rawBody: string;
  query: Map<string, string>;
  ip: string;
  userAgent: string;
  contentType: string;
  size: number;
  createdAt: Date;
}

const requestLogSchema = new Schema<IRequestLog>({
  endpointId: { type: Schema.Types.ObjectId, ref: "Endpoint", required: true },
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  method: {
    type: String,
    required: true,
    enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  },
  headers: { type: Map, of: String, default: {} },
  body: { type: Schema.Types.Mixed, default: null },
  rawBody: { type: String, default: "" },
  query: { type: Map, of: String, default: {} },
  ip: { type: String, default: "" },
  userAgent: { type: String, default: "" },
  contentType: { type: String, default: "" },
  size: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

// auto delete after 7 days. This IS the index on createdAt.
requestLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

// Fast endpoint history page
requestLogSchema.index({ endpointId: 1, createdAt: -1 });

// Fast workspace scoped queries for analytics
requestLogSchema.index({ workspaceId: 1, createdAt: -1 });

export const RequestLog = mongoose.model<IRequestLog>(
  "RequestLog",
  requestLogSchema,
);
