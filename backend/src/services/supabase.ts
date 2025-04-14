import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import jwt, { SignOptions } from "jsonwebtoken";
import { TokenPayloadData } from "../types/interface";

dotenv.config();

export const generateToken = (id: string): string => {
  return jwt.sign(
    {
      id: id,
      sub: id, // Required by Supabase
      role: "authenticated", // Required by Supabase
      aud: "authenticated", // Required by Supabase
    } as TokenPayloadData,
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1d",
      algorithm: "HS256",
    } as SignOptions
  );
};

export const generateSupabaseToken = (userId: string) => {
  const payload = {
    id: userId,
    sub: userId,
    role: "authenticated",
    aud: "authenticated",
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    algorithm: "HS256",
    expiresIn: "1h",
  });
};

export const getSupabaseClient = (userId: string) => {
  const storageToken = generateSupabaseToken(userId);
  const decoded = jwt.decode(storageToken);

  return createClient(
    process.env.SUPABASE_PROJECT_URL as string,
    process.env.SUPABASE_ANON_KEY as string,
    {
      global: {
        headers: {
          Authorization: `Bearer ${storageToken}`,
        },
      },
    }
  );
};
