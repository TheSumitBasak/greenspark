import { Router } from "express";
import {
  authenticateToken,
  requireAdmin,
  requireVerified,
} from "../middleware/auth";
import {
  registerUser,
  getAllUsers,
  verifyUser,
  banUser,
  getUserById,
} from "../controllers/userController";
import handler from "@/utils/handler";

const router = Router();

// Admin: Get all users
router.get("/", authenticateToken, requireAdmin, (req, res) => handler(req, res,getAllUsers));

// Register new user (buyer/seller)
router.post("/register", (req, res) => handler(req, res,registerUser));

// Get user by ID (public info only) - must come before :userId/ routes
router.get("/:userId", (req, res) => handler(req, res,getUserById));

// Admin: Verify user
router.put("/:userId/verify", authenticateToken, requireAdmin, (req, res) => handler(req, res,verifyUser));

// Admin: Ban user
router.put("/:userId/ban", authenticateToken, requireAdmin, (req, res) => handler(req, res,banUser));

export default router;
