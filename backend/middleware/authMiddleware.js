import jwt from "jsonwebtoken";
import User from "../model/User.js";


export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token not found or unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded); // ✅ Add this line for debugging

    const userId = decoded.id || decoded.userId; // Handle both formats
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Token invalid" });
  }
};


export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};

export const isNurse = (req, res, next) => {
    if (!req.user || req.user.role !== "nurse") {
        return res.status(403).json({ message: "Nurse access only" });
    }
    next();
};