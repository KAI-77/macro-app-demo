import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  message: "Too many requests from this IP, please try again later",
  headers: true,
});

export const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  limit: 5,
  message: { error: "Too many attempts, please try again in 5 minutes" },
});

export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 1,
  delayMs: () => 2000,
});
