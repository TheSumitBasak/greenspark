import { Router } from "express";
import { authenticateToken, requireAdmin } from "../middleware/auth";
import {
  getCurrentLeaderboard,
  getLeaderboardByMonth,
  generateLeaderboard,
} from "../controllers/leaderboardController";
import handler from "@/utils/handler";

const router = Router();

// Get current month leaderboard
router.get("/current", (req, res) => handler(req, res, getCurrentLeaderboard));

// Get leaderboard by month
router.get("/month/:month", (req, res) => handler(req, res, getLeaderboardByMonth));

// Generate leaderboard (admin only)
router.post(
  "/generate/:month",
  authenticateToken,
  requireAdmin,
  (req, res) => handler(req, res, generateLeaderboard)
);

export default router;
