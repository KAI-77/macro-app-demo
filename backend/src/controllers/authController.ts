import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { TokenPayload } from "../types/interface";
import { Request, Response } from "express";

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
): Promise<void> => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Check if user exists (using normalized email)
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(409).json({ message: "User with that email already exists" });
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
      res.status(201).json({
        id: user._id, // Fixed the id reference
        name: user.name,
        email: user.email,
        token: generateToken(user._id.toString()), // Convert ObjectId to string
      });
      return;
    }
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
      res.status(409).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "1h",
    // });
    const token = generateToken(user._id.toString());

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};
