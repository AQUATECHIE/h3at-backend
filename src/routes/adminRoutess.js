import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/adminUserController.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id/role", protect, adminOnly, updateUserRole);
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;