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

export default router;
