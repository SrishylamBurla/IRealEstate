import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: ["approve", "reject", "undo"],
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
    // body: String,
    link: String,

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
