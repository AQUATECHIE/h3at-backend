// routes/heroRoutes.js
import express from "express";
import multer from "multer";
import {
  updateHeroImages,
  getHeroImages,
  deleteHeroImage
} from "../controllers/heroController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", getHeroImages);
router.put("/admin", upload.array("images"), updateHeroImages);
router.delete("/admin", deleteHeroImage);

export default router;