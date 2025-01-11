import express from "express";
import { analyzeImage } from "../controllers/analyzeController.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/analyze", protect, upload.single("image"), analyzeImage);

export default router;
