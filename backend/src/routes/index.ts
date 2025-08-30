import { Application } from "express";
import userRoutes from "./users";
import verifierRoutes from "./verifiers";
import verificationRoutes from "./verifications";
import orderRoutes from "./orders";
import leaderboardRoutes from "./leaderboard";
import uploadRoutes from "./upload";
import authRoutes from "./auth";
import blockchainRoutes from "./blockchain";

export default function addRoutes(app: Application) {
  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/verifiers", verifierRoutes);
  app.use("/api/verifications", verificationRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/leaderboard", leaderboardRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/blockchain", blockchainRoutes);
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Green Hydrogen Credits API is running",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    });
  });
}
