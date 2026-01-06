import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    bio: { type: String },
    // address: { type: String },
    password: { type: String, required: true },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
    resetPasswordToken: { type: String },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: ["user", "agent", "admin"],
      default: "user",
    },
    avatar: { type: String, default: "" },
    pushToken: {
      type: String,
    },
    notificationEnabled: {
      type: Boolean,
    },
    notificationPermission: {
      type: String,
      enum: ["granted", "rejected"],
    },
    pushSubscription: {
      type: Object,
      default: null,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["monthly", "yearly"],
      },
      status: {
        type: String,
        enum: ["inactive", "active", "expired"],
        default: "inactive",
      },
      startDate: Date,
      endDate: Date,
      paymentId: String,
    },

    notificationPreferences: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min

  return resetToken;
};

// ✅ FIXED PRE-SAVE HOOK
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("User", userSchema);
