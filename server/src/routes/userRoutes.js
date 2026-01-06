import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { loginUser, registerUser, requestOtp, resetPassword, updateNotificationPreference, updateProfile, verifyOtpAndChangePassword } from "../controllers/userController.js";
import { updateNotificationPreferences } from "../controllers/userController.js";
import { uploadAvatar } from "../controllers/userController.js";                      
import upload from "../middleware/uploadMiddleware.js";
import { updateAvatar } from "../controllers/userController.js";
import { removeAvatar } from "../controllers/userController.js";
import { changePassword } from "../controllers/userController.js";
import rateLimit from "express-rate-limit";
import { forgotPassword } from "../controllers/userController.js";
import { requestLoginOtp, verifyLoginOtp } from "../controllers/userController.js";
import { requestMobileOtp, verifyMobileOtp } from "../controllers/userController.js";
import { getNotificationPreferences } from "../controllers/userController.js";


const router = express.Router();
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
});

router.get(
  "/notifications/preferences",
  protect,
  getNotificationPreferences
);

router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/change-password", protect, changePassword);

router.post("/forgot-password", limiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", limiter, resetPassword);

router.post("/request-otp", protect, requestOtp);
router.post("/verify-otp-password", protect, verifyOtpAndChangePassword);

router.post("/login-otp", requestLoginOtp);
router.post("/verify-login-otp", verifyLoginOtp);

router.post("/request-mobile-otp", requestMobileOtp);
router.post("/verify-mobile-otp", verifyMobileOtp);




router.post("/avatar", protect, upload.single("image"), uploadAvatar);
router.put(
  "/avatar",
  protect,
  upload.single("avatar"),
  updateAvatar
);

router.put("/profile", protect, updateProfile);
router.put("/notifications", protect, updateNotificationPreference);
router.put(
  "/notification-preferences",
  protect,
  updateNotificationPreferences
);
router.delete(
  "/avatar",
  protect,
  removeAvatar
);



export default router;
