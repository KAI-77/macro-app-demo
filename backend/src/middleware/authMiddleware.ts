import jwt from "jsonwebtoken";
import User from "../models/User";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest, JwtPayload } from "../types/interface";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // Check if token is in the authorization header
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Extract token

      // Verify the token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
      const user = await User.findById(decoded.id).select("-password"); // Attach the user to the request

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      (req as AuthenticatedRequest).user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      };

      next(); // Move to the next middleware or route handler
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};

export default protect;
