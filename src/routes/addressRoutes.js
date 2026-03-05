import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { saveAddress, getAddress } from "../controllers/addressController.js";

const router = express.Router();

router.get("/", protect, getAddress);
router.put("/", protect, saveAddress);

export default router;