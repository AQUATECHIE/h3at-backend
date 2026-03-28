import express from "express";
import {
  getPromos,
  createPromo,
  updatePromo,
  deletePromo
} from "../controllers/promoController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* PUBLIC */

router.get("/", getPromos);

/* ADMIN */

router.post("/", protect, adminOnly, upload.single("image"), createPromo);

router.put("/:id", protect, adminOnly, updatePromo);

router.delete("/:id", protect, adminOnly, deletePromo);

export default router;