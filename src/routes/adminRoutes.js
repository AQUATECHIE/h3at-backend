import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAdminAnalytics,getAllUsers, updateUserRole, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/analytics", protect, adminOnly, getAdminAnalytics);
// GET ALL USERS
router.get("/users", protect, adminOnly, getAllUsers);

// UPDATE USER ROLE
router.put("/users/:id/role", protect, adminOnly, updateUserRole);

// DELETE USER
router.delete("/users/:id", protect, adminOnly, deleteUser);

export default router;