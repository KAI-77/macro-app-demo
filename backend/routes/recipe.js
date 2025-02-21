import express, {Router} from 'express';
import {getRecipe} from "../controllers/recipeController.js";
import protect from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/recipe", protect, getRecipe);


export default router;