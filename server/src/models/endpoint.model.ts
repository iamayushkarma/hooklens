import mongoose from "mongoose";

const endpointSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: { type: String, required: true, unique: true, index: true },
    label: { type: String, required: true, trim: true, maxlength: 100 },
    isActive: { type: Boolean, default: true },
    requestCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Compound index for fast user-scoped queries
endpointSchema.index({ userId: 1, createdAt: -1 });
endpointSchema.index({ projectId: 1, createdAt: -1 });

export const Endpoint = mongoose.model("Endpoint", endpointSchema);
