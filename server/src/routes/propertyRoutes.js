import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  // deleteProperty,
  getMyProperties,
  updatePropertyImages,
  resubmitProperty,
  softDeleteProperty,
  permanentDeleteProperty,
  restoreProperty,
  getMyDeletedProperties,
  getAllDeletedProperties
} from "../controllers/propertyController.js";
import { approveProperty } from "../controllers/adminPropertyController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/my", protect, authorize("agent", "admin"), getMyProperties);
router.put(
  "/:id/images",
  protect,
  authorize("agent", "admin"),
  upload.array("images", 10),
  updatePropertyImages
);
router.get("/", getProperties);
router.get(
  "/trash",
  protect,
  authorize("agent", "admin"),
  getMyDeletedProperties
);
router.get("/:id", getPropertyById);

router.post(
  "/",
  protect,
  authorize("agent", "admin"),
  upload.array("images", 10),
  createProperty
);

router.put("/:id", protect, authorize("agent", "admin"), updateProperty);
// router.delete("/:id", protect, authorize("agent", "admin"), deleteProperty);

router.put("/:id/approve", protect, authorize("admin"), approveProperty);
router.put(
  "/:id/resubmit",
  protect,
  authorize("agent", "admin"),
  resubmitProperty
);

router.delete("/:id", protect, authorize("agent", "admin"), softDeleteProperty);
router.put(
  "/:id/restore",
  protect,
  authorize("agent", "admin"),
  restoreProperty
);
router.delete(
  "/:id/permanent",
  protect,
  authorize("admin"),
  permanentDeleteProperty
);

router.get(
  "/admin/trash",
  protect,
  authorize("admin"),
  getAllDeletedProperties
);


export default router;
