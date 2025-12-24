import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateNotificationPreference } from "../controllers/userController.js";

const router = express.Router();

router.put("/notifications", protect, updateNotificationPreference);

export default router;
