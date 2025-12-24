import express from "express";
import {
  createInquiry,
  getMyInquiries,
  updateInquiryStatus,
  getMyRequests,
  getAllInquiries,
} from "../controllers/inquiryController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public 
router.post("/", protect, createInquiry);

// Agent
router.get("/my", protect, authorize("agent", "admin"), getMyInquiries);

router.get("/my-requests", protect, getMyRequests);

router.put(
  "/:id/status",
  protect,
  authorize("agent", "admin"),
  updateInquiryStatus
);

// Admin
router.get("/admin/all", protect, authorize("admin"), getAllInquiries);

export default router;
