import express from "express";
import { getRecipe } from "../controllers/recipeController";
import protect from "../middleware/authMiddleware";

const router = express.Router();

router.post("/recipe", protect as any, getRecipe as any);

export default router;
