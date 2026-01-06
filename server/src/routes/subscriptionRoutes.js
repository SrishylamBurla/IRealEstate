import express from "express";
import { subscribeAgent } from "../controllers/subscriptionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/agent", protect, subscribeAgent);
export default router;