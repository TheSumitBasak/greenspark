import { Router } from "express";
import { loginUser, getCurrentUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// Unified login endpoint for all user types
router.post("/login", loginUser);

// Get current authenticated user
router.get("/profile", authenticateToken, getCurrentUser);

export default router;
