import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import analyzeRoutes from "./routes/analyze.js";
import auth from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.static("public"));

// Connect to the database
connectDB();

// Routes
app.use("/api", analyzeRoutes);
app.use("/api/auth", auth);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
