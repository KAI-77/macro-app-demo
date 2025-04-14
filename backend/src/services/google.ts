import dotenv from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import axios from "axios";
import { TokenResponse } from "../types/interface";
import User from "../models/User";
import cors from "cors";

dotenv.config();
const app = express();

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;
const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const authUrl = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${
  process.env.GOOGLE_CALLBACK_URL
}&response_type=code&scope=${GOOGLE_OAUTH_SCOPES.join(
  " "
)}&access_type=offline`;

app.get(
  "/google/callback",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { code } = req.query;

      if (!code) {
        return res
          .status(400)
          .json({ error: "Authorization code not provided" });
      }

      // Exchange code for tokens
      const tokenResponse = await fetch(GOOGLE_ACCESS_TOKEN_URL as string, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code: code as string,
          client_id: GOOGLE_CLIENT_ID as string,
          client_secret: GOOGLE_CLIENT_SECRET as string,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL as string,
          grant_type: "authorization_code",
        }),
      });

      const tokenData = (await tokenResponse.json()) as TokenResponse;
      if (!tokenResponse.ok) {
        return res.status(400).json({
          error: "Error fetching access token",
          details: tokenData,
        });
      }
      const { access_token, id_token } = tokenData;

      // Get user info
      const userInfoResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const { email, name } = userInfoResponse.data;

      // Find or create user
      let user = await User.findOne({ email }).select("-password");
      if (!user) {
        user = await User.create({ email, name });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "1h",
        }
      );

      // res.status(200).json({ id: user._id, token });
      res.redirect(`http://localhost:5173/login?token=${token}&id=${user._id}`);
    } catch (error) {
      console.error("Google OAuth callback error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  }
);

app.get("/auth/google", (req, res) => {
  res.redirect(authUrl);
});
