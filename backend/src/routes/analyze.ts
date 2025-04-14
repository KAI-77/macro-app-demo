import express from "express";
import { analyzeImage } from "../controllers/analyzeController";
import protect from "../middleware/authMiddleware";
import multer from "multer";
import { UserRequest } from "../types/interface";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(
  "/analyze",
  protect as any,
  upload.single("image"),
  analyzeImage as any
);

export default router;
