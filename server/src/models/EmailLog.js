import mongoose from "mongoose";

const emailLogSchema = new mongoose.Schema(
  {
    to: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["approve", "reject", "undo", "password_reset", "login_otp", "otp", "password_changed"],
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: ["success", "failed"],
      required: true,
    },

    error: {
      type: String,
    },
    
    retryCount: {
      type: Number,
      default: 0,
    },

    lastTriedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("EmailLog", emailLogSchema);
