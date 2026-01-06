import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyNotifications,
  markAsRead,
  markAllRead,
  clearAllNotifications,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/my", protect, getMyNotifications);
router.put("/:id/read", protect, markAsRead);
router.put("/mark-all-read", protect, markAllRead);
router.delete("/clear", protect, clearAllNotifications);

export default router;
