import { Router } from "express";
import {
  authenticateToken,
  requireAdmin,
  requireVerified,
} from "../middleware/auth";
import {
  registerVerifier,
  startVerifierVote,
  getVotingStatus,
  getAllVerifiers,
  getVerifierById,
  updateVerifierStatus,
  getActiveVerifiers,
  syncVotingStatus,
  checkVotingEligibility,
} from "../controllers/verifierController";
import handler from "@/utils/handler";

const router = Router();

// Get all verifiers
router.get("/", authenticateToken, (req, res) =>
  handler(req, res, getAllVerifiers)
);

// Register new verifier (admin only)
router.post("/register", authenticateToken, requireAdmin, (req, res) =>
  handler(req, res, registerVerifier)
);

// Start voting for verifier (admin only)
router.post(
  "/:verifierId/start-vote",
  authenticateToken,
  requireAdmin,
  (req, res) => handler(req, res, startVerifierVote)
);

// Get voting status for verifier
router.get("/:verifierId/voting-status", authenticateToken, (req, res) =>
  handler(req, res, getVotingStatus)
);

// Check voting eligibility for a specific wallet address
router.post("/:verifierId/check-eligibility", (req, res) =>
  handler(req, res, checkVotingEligibility)
);

// Get active verifiers only (must come before :verifierId routes)
router.get("/active/list", (req, res) => handler(req, res, getActiveVerifiers));

// Get verifier by ID
router.get("/:verifierId", authenticateToken, (req, res) =>
  handler(req, res, getVerifierById)
);

// Update verifier status (admin only)
router.put("/:verifierId/status", authenticateToken, requireAdmin, (req, res) =>
  handler(req, res, updateVerifierStatus)
);

// Sync voting status from blockchain (admin only)
router.post(
  "/:verifierId/sync-voting",
  authenticateToken,
  requireAdmin,
  (req, res) => handler(req, res, syncVotingStatus)
);

export default router;
