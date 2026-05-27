import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  discription: {
    type: String,
    default: "",
  },
});

export const Project = mongoose.model("Project", projectSchema);
