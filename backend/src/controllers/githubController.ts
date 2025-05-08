import axios from "axios";
import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenResponse, GithubUserInfo, GithubEmail } from "../types/interface";
import User from "../models/User";

dotenv.config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_CALLBACK_URL}&scope=user:email`;

export const githubLogin = (req: Request, res: Response) => {
  res.redirect(authUrl);
};

export const githubAuthCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  try {
    const tokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const { access_token } = tokenResponse.data as TokenResponse;
    const userInfoResponse = await axios.get<GithubUserInfo>(
      "https://api.github.com/user",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const emailResponse = await axios.get<GithubEmail[]>(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );

    const email = emailResponse.data.find((e) => e.primary)?.email;
    const name = userInfoResponse.data.name || userInfoResponse.data;

    let user = await User.findOne({ email }).select("-password");
    if (!user) {
      user = await User.create({ email, name, provider: "github" });
    }
    console.log("User created:", user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    res.redirect(
      `${process.env.FRONTEND_URL}/login?token=${token}&id=${user._id}`
    );
  } catch (error) {
    console.error("Github auth error:", error);
    res.status(500).json({ error: "Github Authentication failed" });
  }
};
