import { Router } from "express";
import {
  authenticateToken,
  requireVerified,
  requireVerifier,
} from "../middleware/auth";
import {
  submitVerification,
  approveVerification,
  rejectVerification,
  getVerificationSubmissions,
  getVerificationById,
  getPendingVerifications,
  getUserVerificationHistory,
} from "../controllers/verificationController";
import handler from "@/utils/handler";

const router = Router();

// Submit verification (sellers only)
router.post("/submit", authenticateToken, requireVerified, (req, res) => handler(req, res, submitVerification));

// Approve verification (verifiers only)
router.post(
  "/:submissionId/approve",
  authenticateToken,
  requireVerifier,
  (req, res) => handler(req, res, approveVerification)
);

// Reject verification (verifiers only)
router.post(
  "/:submissionId/reject",
  authenticateToken,
  requireVerifier,
  (req, res) => handler(req, res, rejectVerification)
);

// Get verification submissions (filtered by user role)
router.get("/", authenticateToken, (req, res) => handler(req, res, getVerificationSubmissions));

// Get pending verifications (for verifiers) - must come before :submissionId routes
router.get(
  "/pending/list",
  authenticateToken,
  requireVerifier,
  (req, res) => handler(req, res, getPendingVerifications)
);

// Get user's verification history - must come before :submissionId routes
router.get(
  "/user/history",
  authenticateToken,
  requireVerified,
  (req, res) => handler(req, res, getUserVerificationHistory)
);

// Get verification submission by ID
router.get("/:submissionId", authenticateToken, (req, res) => handler(req, res, getVerificationById));

export default router;
