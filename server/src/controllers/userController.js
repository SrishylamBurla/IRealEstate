import User from "../models/User.js";
import cloudinary from "cloudinary";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";
import { resetPasswordEmail } from "../utils/emailTemplate.js";
import Otp from "../models/Otp.js";
import { sendSms } from "../utils/sendSms.js";
import { sendWhatsappOtp } from "../utils/sendWhatsappOtp.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log(req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      phone,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};


export const getNotificationPreferences = async (req, res) => {
  res.json(req.user.notificationPreferences);
};


export const updateNotificationPreference = async (req, res) => {
  const { permission, token } = req.body;

  console.log("🔔 Saving notification preference:", permission);
  console.log("📌 Saving push token:", token);

  req.user.notificationPermission = permission;
  req.user.notificationEnabled = permission === "granted";

  if (token) {
    req.user.pushToken = token;
  }

  await req.user.save();

  res.json({ message: "Notification settings updated" });
};

// controllers/userController.js

export const updateNotificationPreferences = async (req, res) => {
  const { inApp, email, push } = req.body;

  req.user.notificationPreferences = {
    inApp: inApp ?? req.user.notificationPreferences.inApp,
    email: email ?? req.user.notificationPreferences.email,
    push: push ?? req.user.notificationPreferences.push,
  };

  await req.user.save();

  res.json({
    message: "Notification preferences updated",
    preferences: req.user.notificationPreferences,
  });
};


export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old avatar if exists
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }

    user.avatar = req.file.path;
    await user.save();

    res.json({
      message: "Avatar updated",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("AVATAR UPLOAD ERROR:", error);
    res.status(500).json({ message: "Failed to upload avatar" });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove old avatar if exists
    if (user.avatar) {
      const publicId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`avatars/${publicId}`);
    }

    user.avatar = req.file.path;
    await user.save();

    res.json({
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("UPDATE AVATAR ERROR:", error);
    res.status(500).json({ message: "Failed to update avatar" });
  }
};

export const removeAvatar = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🗑️ Delete from cloudinary
  if (user.avatar) {
    const publicId = user.avatar.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(`real-estate/avatars/${publicId}`);
  }

  user.avatar = null;
  await user.save();

  res.json({ avatar: null });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  user.bio = req.body.bio ?? user.bio;

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    bio: user.bio,
  });
};

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (!/\d/.test(newPassword) || newPassword.length < 8) {
    return res.status(400).json({
      message: "Password must be at least 8 characters and include a number",
    });
  }

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Current password incorrect" });
  }

  user.password = newPassword;
  user.passwordChangedAt = Date.now();
  await user.save();

  res.json({ message: "Password updated successfully" });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // 🔒 Always return same message
  if (!user) {
    return res.json({
      message: "If this email exists, a reset link was sent",
    });
  }
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html: resetPasswordEmail(user.name, resetUrl),
    type: "password_reset",
    userId: user._id,
  });

  res.json({
    message: "If this email exists, a reset link was sent",
  });
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Invalid request" });
    }

    // 🔐 hash token to match DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Token expired or invalid",
      });
    }

    // 🔑 Update password
    user.password = password;
    user.passwordChangedAt = Date.now();
    // 🔥 Clear reset fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // 📧 optional email
    sendEmail({
      to: user.email,
      subject: "Password Changed Successfully",
      html: `<p>Your password has been updated.</p>`,
      type: "password_changed",
      userId: user._id,
    }).catch(() => {});

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Reset failed" });
  }
};

export const requestOtp = async (req, res) => {
  const user = req.user;

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();

  await Otp.deleteMany({ user: user._id, purpose: "change_password" });

  await Otp.create({
    user: user._id,
    otp,
    purpose: "change_password",
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  await sendEmail({
    to: user.email,
    subject: "OTP for Password Change",
    html: `<h3>Your OTP: ${otp}</h3><p>Valid for 15 minutes</p>`,
    type: "otp",
    userId: user._id,
  });

  res.json({ message: "OTP sent successfully" });
};

export const verifyOtpAndChangePassword = async (req, res) => {
  const { otp, newPassword } = req.body;

  const record = await Otp.findOne({
    user: req.user._id,
    otp,
    purpose: "change_password",
  });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP invalid or expired" });
  }

  if (!/^(?=.*\d).{8,}$/.test(newPassword)) {
    return res.status(400).json({
      message: "Password must be 8 chars with number",
    });
  }

  const salt = await bcrypt.genSalt(10);
  req.user.password = await bcrypt.hash(newPassword, salt);
  await req.user.save();

  await Otp.deleteMany({ user: req.user._id });

  res.json({ message: "Password changed successfully" });
};

export const requestLoginOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = crypto.randomInt(100000, 999999).toString();

  await Otp.deleteMany({ user: user._id, purpose: "login" });

  await Otp.create({
    user: user._id,
    identifier: email,
    otp,
    purpose: "login",
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  await sendEmail({
    to: email,
    subject: "Your Login OTP",
    html: `<h2>${otp}</h2><p>Valid for 15 minutes</p>`,
    type: "login_otp",
    userId: user._id,
  });

  res.json({ message: "OTP sent" });
};

export const verifyLoginOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const record = await Otp.findOne({
    user: user._id,
    otp,
    purpose: "login",
  });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP invalid or expired" });
  }

  await Otp.deleteMany({ user: user._id });

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const requestMobileOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: "Phone number required" });
  }

  const user = await User.findOne({ phone });

  const otp = crypto.randomInt(100000, 999999).toString();

  await Otp.deleteMany({ identifier: phone, purpose: "mobile_login" });

  await Otp.create({
    identifier: phone,
    otp,
    purpose: "mobile_login",
    user: user?._id,
    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
  });

  let delivery = "mobile";

  try {
    await sendWhatsappOtp({ phone, otp });
    res.json({ message: "OTP sent via WhatsApp" });
  } catch (err) {
    console.error("WhatsApp OTP failed", err);
    res.status(500).json({
      message: "Failed to send WhatsApp OTP",
    });
  }

  try {
    await sendSms({
      to: phone,
      message: `Your iRealEstate OTP is ${otp}. Valid for 15 minutes.`,
    });
  } catch (err) {
    console.warn("📵 SMS failed, falling back to email");

    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "Login OTP",
        html: `<h2>${otp}</h2><p>Valid for 15 minutes</p>`,
        type: "login_otp",
        userId: user._id,
      });
      delivery = "email";
    }
  }

  res.json({
    message: `OTP sent via ${delivery}`,
  });
};

export const verifyMobileOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP required" });
  }

  const record = await Otp.findOne({
    identifier: phone,
    purpose: "mobile_login",
  });

  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: "OTP expired or invalid" });
  }

  if (record.attempts >= 5) {
    return res.status(429).json({ message: "Too many attempts" });
  }

  if (record.otp !== otp) {
    record.attempts += 1;
    await record.save();
    return res.status(400).json({ message: "Invalid OTP" });
  }

  await record.deleteOne();

  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      name: "User",
      phone,
      role: "user",
      password: crypto.randomBytes(16).toString("hex"), // hashed by pre-save
    });
  }

  res.json({
    _id: user._id,
    name: user.name,
    role: user.role,
    phone: user.phone,
    token: generateToken(user._id),
  });
};


// export const subscribeAgent = async (req, res) => {
//   const { plan } = req.body;

//   if (!["monthly", "yearly"].includes(plan)) {
//     return res.status(400).json({ message: "Invalid plan" });
//   }

//   const user = await User.findById(req.user._id);

//   if (user.role === "agent") {
//     return res.status(400).json({ message: "Already an agent" });
//   }

//   const duration =
//     plan === "monthly" ? 30 : 365;

//   const start = new Date();
//   const end = new Date();
//   end.setDate(start.getDate() + duration);

//   user.role = "agent";
//   user.subscription = {
//     plan,
//     status: "active",
//     startDate: start,
//     endDate: end,
//     paymentId: "manual_demo_payment",
//   };

//   await user.save();

//   res.json({
//     message: "Subscription activated",
//     role: user.role,
//     subscription: user.subscription,
//   });
// };


export const getSubscriptionStatus = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user.role !== "agent") {
    return res.status(400).json({ message: "Not an agent" });
  }
  res.json({
    subscription: user.subscription,
  });
}