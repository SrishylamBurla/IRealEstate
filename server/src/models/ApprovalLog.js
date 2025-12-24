import mongoose from "mongoose";

const approvalLogSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: ["approved", "rejected", "undo_reject", "resubmitted"],
      required: true,
    },

    reason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ApprovalLog", approvalLogSchema);
