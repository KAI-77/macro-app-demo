import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import {handleValidationErrors, validateLogin, validateRegistration} from "../middleware/validators.js";

const router = express.Router();

router.post("/register", validateRegistration, handleValidationErrors, registerUser);
router.post("/login", validateLogin, handleValidationErrors,  loginUser);

router.get("/verify", protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
});

export default router;
