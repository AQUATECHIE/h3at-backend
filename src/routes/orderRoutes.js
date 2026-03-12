import express from "express";
import {
  createOrder,
  createGuestOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/* USER ORDER */
router.post("/", protect, createOrder);

/* GUEST ORDER */
router.post("/guest", createGuestOrder);

/* USER ORDERS */
router.get("/my-orders", protect, getMyOrders);

/* ADMIN */
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;