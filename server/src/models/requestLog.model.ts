import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema({
  endpointId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Endpoint",
    required: true,
    index: true,
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  method: {
    type: String,
    required: true,
    enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"],
  },
  headers: { type: Map, of: String },
  body: { type: mongoose.Schema.Types.Mixed, default: null },
  rawBody: { type: String, default: "" },
  query: { type: Map, of: String },
  ip: { type: String, default: "" },
  userAgent: { type: String, default: "" },
  contentType: { type: String, default: "" },
  size: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true },
});

// TTL — auto-delete after 7 days
requestLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

// Fast lookup for endpoint's request history
requestLogSchema.index({ endpointId: 1, createdAt: -1 });

export const RequestLog = mongoose.model("RequestLog", requestLogSchema);
