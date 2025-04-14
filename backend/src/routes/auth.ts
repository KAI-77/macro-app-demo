import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import protect from "../middleware/authMiddleware";
import {
  handleValidationErrors,
  validateLogin,
  validateRegistration,
} from "../middleware/validators";
import { AuthenticatedRequest } from "../types/interface";

const router = express.Router();

router.post(
  "/register",
  validateRegistration as any,
  handleValidationErrors as any,
  registerUser as any
);
router.post(
  "/login",
  validateLogin as any,
  handleValidationErrors as any,
  loginUser as any
);

router.get("/verify", protect as any, async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      user: (req as AuthenticatedRequest).user,
    });
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
});

export default router;
