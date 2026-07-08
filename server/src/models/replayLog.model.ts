import mongoose, { Document, Schema } from "mongoose";

export interface IReplayLog extends Document {
  requestId: mongoose.Types.ObjectId;

  endpointId: mongoose.Types.ObjectId;

  workspaceId: mongoose.Types.ObjectId;

  userId: mongoose.Types.ObjectId;

  targetUrl: string;

  status: number;

  responseHeaders: Map<string, string>;

  responseBody: unknown;

  durationMs: number;

  error?: string;

  createdAt: Date;
}

const replayLogSchema = new Schema<IReplayLog>({
  requestId: {
    type: Schema.Types.ObjectId,
    ref: "RequestLog",
    required: true,
  },

  endpointId: {
    type: Schema.Types.ObjectId,
    ref: "Endpoint",
    required: true,
  },

  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  targetUrl: {
    type: String,
    required: true,
    trim: true,
  },

  status: {
    type: Number,
    required: true,
  },

  responseHeaders: {
    type: Map,
    of: String,
    default: {},
  },

  responseBody: {
    type: Schema.Types.Mixed,
    default: null,
  },

  durationMs: {
    type: Number,
    default: 0,
    min: 0,
  },

  error: {
    type: String,
    default: "",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Fast replay history lookup
replayLogSchema.index({
  requestId: 1,
  createdAt: -1,
});

// Fast endpoint analytics
replayLogSchema.index({
  endpointId: 1,
  createdAt: -1,
});

// Fast workspace analytics
replayLogSchema.index({
  workspaceId: 1,
  createdAt: -1,
});

export const ReplayLog = mongoose.model<IReplayLog>(
  "ReplayLog",
  replayLogSchema,
);
