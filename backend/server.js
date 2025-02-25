import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import analyzeRoutes from "./routes/analyze.js";
import auth from "./routes/auth.js";
import recipeRoutes from "./routes/recipe.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: "Too many requests from this IP, please try again later",
  headers: true,
})

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5,
  message: { error: "Too many attempts, please try again in 5 minutes" },
})

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: () => 2000,
})

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://trusted-cdn.com"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin"},
  dnsPrefetchControl: { allow: false },
  expectCt: { maxAge: 86400, enforce: true },
  frameguard: { action: "deny" },
  hidePoweredBy: true,
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  permittedCrossDomainPolicies: { permittedPolicies: "none" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },

}));

// Middleware
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.static("public"));
app.use(speedLimiter)
app.use(globalLimiter);

// Connect to the database
connectDB();

// Routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/api/auth", auth);

app.use("/api", analyzeRoutes);
app.use("/api", recipeRoutes);



// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
