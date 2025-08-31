import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user as any;

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "User not authenticated" });
    }

    if (user.type !== "admin") {
      return res
        .status(403)
        .json({ success: false, error: "Admin access required" });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Admin verification failed" });
  }
};
