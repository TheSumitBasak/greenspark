import { Request, Response } from "express";
import { Verifier, User } from "../models";
import { getContract, handleBlockchainError } from "../config/blockchain";

export const registerVerifier = async (req: Request, res: Response) => {
  const { organizationName, walletAddress, documents } = req.body;

  if (!organizationName || !walletAddress) {
    return res
      .status(400)
      .json({ error: "Organization name and wallet address required" });
  }

  // Check if verifier already exists
  const existingVerifier = await Verifier.findOne({ walletAddress });

  if (existingVerifier) {
    return res
      .status(400)
      .json({ error: "Verifier already exists with this wallet address" });
  }

  // Create verifier in MongoDB
  const verifier = new Verifier({
    organizationName,
    walletAddress,
    documents: documents || [],
    status: "pending",
  });

  await verifier.save();

  // Register verifier on blockchain
  try {
    const contract = getContract();
    await contract.registerVerifier(
      walletAddress,
      organizationName,
      documents || []
    );
  } catch (blockchainError) {
    // If blockchain fails, delete the MongoDB record
    await Verifier.findByIdAndDelete(verifier._id);
    throw handleBlockchainError(blockchainError);
  }

  res.status(201).json({
    success: true,
    message: "Verifier registered successfully",
    verifier: {
      id: verifier._id,
      organizationName: verifier.organizationName,
      walletAddress: verifier.walletAddress,
      status: verifier.status,
    },
  });
};

export const startVerifierVote = async (req: Request, res: Response) => {
  const { verifierId } = req.params;

  const verifier = await Verifier.findById(verifierId);

  if (!verifier) {
    return res.status(404).json({ error: "Verifier not found" });
  }

  if (verifier.status === "active") {
    return res.status(400).json({ error: "Verifier is already active" });
  }

  // Start vote on blockchain
  try {
    const contract = getContract();
    await contract.startVerifierVote(verifier.walletAddress);
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }

  res.json({
    success: true,
    message: "Voting started for verifier",
    verifier,
  });
};

export const getVotingStatus = async (req: Request, res: Response) => {
  const { verifierId } = req.params;

  const verifier = await Verifier.findById(verifierId);

  if (!verifier) {
    return res.status(404).json({ error: "Verifier not found" });
  }

  // Get voting status from blockchain
  try {
    const contract = getContract();
    const verifierData = await contract.getVerifierData(verifier.walletAddress);
    const hasVoted = await contract.hasVoted(
      verifier.walletAddress,
      (req as any).user.walletAddress
    );

    res.json({
      success: true,
      votingStatus: {
        verifierId: verifier._id,
        walletAddress: verifier.walletAddress,
        organizationName: verifier.organizationName,
        voteStart: verifierData.voteStart,
        voteEnd: verifierData.voteEnd,
        yesVotes: verifierData.yesVotes,
        noVotes: verifierData.noVotes,
        isActive: verifierData.active,
        canVote: Date.now() / 1000 <= verifierData.voteEnd,
        hasVoted: hasVoted,
      },
    });
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }
};

export const getAllVerifiers = async (req: Request, res: Response) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter: any = {};

  if (status) filter.status = status;

  const verifiers = await Verifier.find(filter)
    .select("-__v")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await Verifier.countDocuments(filter);

  res.json({
    success: true,
    verifiers,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getVerifierById = async (req: Request, res: Response) => {
  const { verifierId } = req.params;

  const verifier = await Verifier.findById(verifierId).select("-__v");

  if (!verifier) {
    return res.status(404).json({ error: "Verifier not found" });
  }

  res.json({
    success: true,
    verifier,
  });
};

export const updateVerifierStatus = async (req: Request, res: Response) => {
  const { verifierId } = req.params;
  const { status } = req.body;

  if (!["pending", "active", "rejected", "banned"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const verifier = await Verifier.findById(verifierId);

  if (!verifier) {
    return res.status(404).json({ error: "Verifier not found" });
  }

  verifier.status = status;
  await verifier.save();

  res.json({
    success: true,
    message: "Verifier status updated",
    verifier,
  });
};

export const getActiveVerifiers = async (req: Request, res: Response) => {
  const verifiers = await Verifier.find({ status: "active" })
    .select("organizationName walletAddress")
    .sort({ organizationName: 1 });

  res.json({
    success: true,
    verifiers,
  });
};
