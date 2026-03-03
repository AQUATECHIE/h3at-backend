import express from "express";
import {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem
} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getUserCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove", protect, removeCartItem);

export default router;