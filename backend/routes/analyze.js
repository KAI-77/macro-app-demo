import express from "express";
import { analyzeImage } from "../controllers/analyzeController.js";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post("/analyze", protect, upload.single("image"), analyzeImage);

export default router;
