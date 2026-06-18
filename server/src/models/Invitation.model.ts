import mongoose, { Schema, Document } from "mongoose";

const InvitationSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    invitedByUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "member", "viewer"],
      default: "member",
    },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "expired"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Invitation = mongoose.model("Invitation", InvitationSchema);
