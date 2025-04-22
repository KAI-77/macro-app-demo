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
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === 11000
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

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const message = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h1>You requested a password reset</h1>
        <p>Please click on the following link to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>If you didn't request this, please change your password immediately.</p>
        <p>This link will expire in 5 minutes.</p>
      `,
    };

    await transporter.sendMail(message);

    return res.status(200).json({
      success: true,
      message: "Password reset email sent",
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
