import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
      minlength: 1,
      maxlength: 100,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate project names inside same workspace
projectSchema.index({ workspaceId: 1, name: 1 }, { unique: true });

export const Project = mongoose.model("Project", projectSchema);
