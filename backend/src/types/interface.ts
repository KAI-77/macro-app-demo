import { Request } from "express";
import { SignOptions, Algorithm } from "jsonwebtoken";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  provider: "local" | "google" | "github";
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}

export interface GoogleUserInfo {
  email: string;
  name: string;
}

export interface GithubUserInfo {
  username: string;
  email: string;
  name: string;
}

export interface GithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

export interface MimeTypes {
  [key: string]: string;
}

export interface TokenPayload {
  id: string;
  sub: string;
  role: "authenticated";
  aud: "authenticated";
}

export interface RecipeRequest extends Request {
  body: {
    ingredients: string;
  };
}

export interface UserRequest extends Request {
  user: {
    id: number;
  };
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    name?: string;
    email?: string;
  };
}

export interface JwtPayload {
  id: number;
}

export interface TokenResponse {
  access_token: string;
  id_token: string;
}

export interface CustomSignOptions {
  expiresIn: number | string;
  algorithm?: Algorithm;
}

export interface TokenPayloadData {
  id: string;
  sub: string;
  role: string;
  aud: string;
}

export interface ForgotPasswordRequest extends Request {
  email: string;
}

export interface ResetPasswordRequest extends Request {
  password: string;
  confirmPassword: string;
}
