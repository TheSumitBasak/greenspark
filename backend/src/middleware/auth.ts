import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, Verifier } from "../models";

interface AuthRequest extends Request {
  user?: any;
}

export interface JWTPayload {
  userId: string;
  walletAddress: string;
  role: string;
  userType?: string;
  email?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ error: "Access token required" });
      return;
    }

    const decoded = verifyToken(token);
    let user: any = null;

    // Find user based on userType from token
    switch (decoded.userType) {
      case "user":
        user = await User.findById(decoded.userId);
        break;
      case "verifier":
        user = await Verifier.findById(decoded.userId);
        break;
      case "admin":
        user = {
          id: "ADMIN",
          name: "admin",
          email: "admin@gmail.com",
          walletAddress: decoded.walletAddress,
          status: "verified",
          role: "admin",
          type: "admin",
        };
        break;
      default:
        res.status(401).json({ error: "Invalid user type" });
        return;
    }

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Check if user is banned based on their type
    const isBanned =
      user.status === "banned" ||
      (user.status === "inactive" && decoded.userType === "admin");

    if (isBanned) {
      res.status(403).json({ error: "User is banned or inactive" });
      return;
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!(req as any).user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    const userRole = (req as any).user.role || (req as any).user.type;
    if (!roles.includes(userRole)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
};

export const requireVerified = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!(req as any).user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if ((req as any).user.status !== "verified") {
    res.status(403).json({ error: "User must be verified" });
    return;
  }

  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!(req as any).user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const userType = (req as any).user.type || (req as any).user.role;
  if (userType !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
};

export const requireVerifier = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!(req as any).user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  const userType = (req as any).user.type || (req as any).user.role;
  if (userType !== "verifier") {
    res.status(403).json({ error: "Verifier access required" });
    return;
  }

  if ((req as any).user.status !== "active") {
    res.status(403).json({ error: "Verifier must be active" });
    return;
  }

  next();
};
