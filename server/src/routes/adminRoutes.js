import express from "express";
import { protect } from "../middleware/authMiddleware.js";
// import { adminOnly } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";
import {
  getAllUsers,
  getAllProperties,
  getAllInquiries,
} from "../controllers/adminController.js";
import { getPendingProperties, getPropertyApprovalHistory } from "../controllers/propertyController.js";
// import { approveProperty } from "../controllers/adminPropertyController.js";
import { rejectProperty } from "../controllers/adminPropertyController.js";
import { undoRejectProperty } from "../controllers/adminPropertyController.js";
import { getEmailLogs } from "../controllers/adminEmailController.js";
import { resendEmail } from "../controllers/adminEmailController.js";
import { saveSubscription } from "../controllers/PushController.js";

const router = express.Router();

router.get("/users", protect, authorize("admin"), getAllUsers);
router.get("/properties", protect, authorize("admin"), getAllProperties);
router.get("/inquiries", protect, authorize("admin"), getAllInquiries);
// router.get(
//   "/properties/:id/approve",
//   protect,
//   authorize("admin"),
//   approveProperty
// )
router.get(
  "/properties/pending",
  protect,
  authorize("admin"),
  getPendingProperties
);
router.put(
  "/properties/:id/reject",
  protect,
  authorize("admin"),
  rejectProperty
);
router.put(
  "/properties/:id/undo-reject",
  protect,
  authorize("admin"),
  undoRejectProperty
);

router.get(
  "/properties/:id/history",
  protect,
  authorize("admin", "agent"),
  getPropertyApprovalHistory
);

router.get(
  "/email-logs",
  protect,
  authorize("admin"),
  getEmailLogs
);

router.put(
  "/email-logs/:id/resend",
  protect,
  authorize("admin"),
  resendEmail
);
router.post("/subscribe", protect, saveSubscription);


export default router;
