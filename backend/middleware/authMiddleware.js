import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];
      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401), json({ message: "Something went wrong" });
    }
  }
  if (!token) {
    res.status(401).json({ message: "Invalid token" });
  }
};
