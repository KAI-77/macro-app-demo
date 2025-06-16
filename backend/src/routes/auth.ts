import express, { Request, RequestHandler, Response } from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import protect from "../middleware/authMiddleware";
import {
  handleValidationErrors,
  validateLogin,
  validateRegistration,
  validateResetPassword,
} from "../middleware/validators";
import { AuthenticatedRequest } from "../types/interface";

const router = express.Router();

router.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  registerUser as any
);
router.post("/login", validateLogin, handleValidationErrors, loginUser as any);
router.post("/forgot-password", forgotPassword as any);
router.post(
  "/reset-password/:token",
  validateResetPassword,
  handleValidationErrors,
  handleValidationErrors,
  resetPassword as any
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
