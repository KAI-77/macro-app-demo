import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import analyzeRoutes from "./routes/analyze";
import auth from "./routes/auth";
import recipeRoutes from "./routes/recipe";
import { globalLimiter, speedLimiter, authLimiter } from "./utils/api";

import { securityConfig } from "./utils/helmet";
import {
  githubAuthCallback,
  githubLogin,
} from "./controllers/githubController";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:5173", "https://vitascan.vercel.app"];

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(express.static("public"));
app.use(speedLimiter);
app.use(globalLimiter);
app.use(securityConfig);

// Connect to the database
connectDB();

// Routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api/auth", auth);

app.use("/auth/github", githubLogin);
app.use("/github/callback", githubAuthCallback);
app.use("/api", analyzeRoutes);
app.use("/api", recipeRoutes);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
