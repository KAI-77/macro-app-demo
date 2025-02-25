import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Generate jwt token

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Register user

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;


    // Check if user exists (using normalized email)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
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
        id: user._id,  // Fixed the id reference
        name: user.name,
        email: user.email,
        token: generateToken(user._id),  // Fixed the id reference
      });
    }
  } catch (error) {
    console.error('Registration error:', error);  // Add logging

    // More specific error handling
    if (error.code === 11000) {  // MongoDB duplicate key error
      return res.status(409).json({ message: "User already exists" });
    }

    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user

export const loginUser = async (req, res) => {
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ user: {
      id: user._id, email: user.email, name: user.name
      },
      token, message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login" });
  }
};
