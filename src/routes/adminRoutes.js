import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAdminAnalytics } from "../controllers/adminController.js";

const router = express.Router();

router.get("/analytics", protect, adminOnly, getAdminAnalytics);

export default router;