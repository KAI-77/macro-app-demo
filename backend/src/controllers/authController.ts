import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { TokenPayload } from "../types/interface";
import { Request, Response } from "express";
import crypto from "crypto";
import transporter from "../config/emailConfig";
import {
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/interface";
// Generate jwt token

const generateToken = (id: string): string => {
  return jwt.sign(
    {
      id: id,
      sub: id,
      role: "authenticated",
      aud: "authenticated",
    } as TokenPayload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
      algorithm: "HS256",
    } as SignOptions
  );
};

// Register user

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if user exists (using normalized email)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "User with that email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      return res.status(201).json({
        id: user._id, // Fixed the id reference
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()), // Convert ObjectId to string
      });
    }
    return res.status(400).json({ message: "Failed to create user" });
  } catch (error) {
    console.error("Registration error:", error); // Add logging

    // More specific error handling
    if (
      error instanceof Error &&
      "code" in error &&
      (error as any).code === 11000
    ) {
      // MongoDB duplicate key error
      return res.status(409).json({ message: "User already exists" });
    }

    return res
      .status(500)
      .json({ message: "Server error during registration" });
  }
};

// Login user

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    const token = generateToken(user._id.toString());

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error); // Add logging
    return res.status(500).json({ message: "Server error during login" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email } = req.body as ForgotPasswordRequest;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token for forget password

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    const FRONTEND_URL =
      process.env.NODE_ENV === "production"
        ? "https://vitascan.vercel.app"
        : "http://localhost:5173";

    // Create reset URL
    const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
    const message = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset - VitaScan",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #3182CE; text-align: center;">Reset Your Password</h1>
          <p>Hello ${user.name},</p>
          <p>You recently requested to reset your password for your VitaScan account. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #3182CE; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 5px;
                      display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #718096; font-size: 14px;">
            This link will expire in 10 minutes for security reasons.
            If you didn't request this reset, please ignore this email.
          </p>
          <hr style="border: 1px solid #E2E8F0; margin: 20px 0;">
          <p style="color: #718096; font-size: 12px; text-align: center;">
            © 2025 VitaScan. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(message);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
      expiresIn: "10 minutes",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({
      message: "Error sending reset email",
    });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { password, confirmPassword } = req.body as ResetPasswordRequest;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Set new password
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({
      message: "Error resetting password",
    });
  }
};
