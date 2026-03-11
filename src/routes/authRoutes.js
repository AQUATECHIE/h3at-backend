import express from "express";
import { registerUser, loginUser, verifyOtp,updateProfile,resendOtp} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.put("/update-profile", protect, updateProfile);

export default router;