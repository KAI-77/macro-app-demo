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
import axios from 'axios';
import User from "./models/User.js";
import jwt from "jsonwebtoken";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authUrl = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=${GOOGLE_OAUTH_SCOPES.join(" ")}&access_type=offline`;


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


app.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ error: "Authorization code not provided" });
    }


    // Exchange code for tokens
    const tokenResponse = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),


    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      return res.status(400).json({ error: "Error fetching access token", details: tokenData });
    }
    const { access_token, id_token } = tokenData;

    // Get user info
    const userInfoResponse = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name } = userInfoResponse.data;

    // Find or create user
    let user = await User.findOne({ email }).select("-password");
    if (!user) {
      user = await User.create({ email, name });
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });


    // res.status(200).json({ id: user._id, token });
    res.redirect(`http://localhost:5173/login?token=${token}&id=${user._id}`);


  } catch (error) {
    console.error("Google OAuth callback error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

app.get("/auth/google", (req, res) => {
  res.redirect(authUrl);
})


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
