import express from "express";
import {
  subscribeNewsletter,
  sendNewsletterBroadcast
} from "../controllers/newsletterController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", subscribeNewsletter);

/* ADMIN SEND NEWSLETTER */

router.post(
  "/broadcast",
  protect,
  adminOnly,
  sendNewsletterBroadcast
);

export default router;