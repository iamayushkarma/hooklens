import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "workspace_invite",
        "member_joined",
        "member_left",
        "role_changed",
        "project_created",
        "endpoint_created",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    data: {
      type: Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Notification = mongoose.model("Notification", NotificationSchema);
