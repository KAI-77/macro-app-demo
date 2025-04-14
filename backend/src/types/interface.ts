import { Request } from "express";
import { SignOptions, Algorithm } from "jsonwebtoken";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  provider: string;
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
