import { Request, Response } from "express";
import { VerificationSubmission, User } from "../models";
import { getContract, handleBlockchainError } from "../config/blockchain";

export const submitVerification = async (req: Request, res: Response) => {
  const { amount, documents } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Valid amount required" });
  }

  if (!documents || documents.length === 0) {
    return res.status(400).json({ error: "Documents required" });
  }

  // Check if user is a seller
  if ((req as any).user.role !== "seller") {
    return res
      .status(403)
      .json({ error: "Only sellers can submit verifications" });
  }

  // Submit directly to blockchain first
  let submissionId: number;
  try {
    const contract = getContract();
    const tx = await contract.submitVerification(amount, documents);
    const receipt = await tx.wait();

    // Extract submission ID from event
    const event = receipt.events?.find(
      (e: any) => e.event === "VerificationSubmitted"
    );
    submissionId = event?.args?.submissionId?.toNumber();

    if (!submissionId) {
      throw new Error("Failed to get submission ID from blockchain");
    }
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }

  // Create record in MongoDB for tracking
  const verification = new VerificationSubmission({
    sellerId: (req as any).user._id,
    amount,
    documents,
    status: "pending",
    timestamp: new Date(),
  });

  await verification.save();

  res.status(201).json({
    success: true,
    message: "Verification submitted successfully",
    submission: {
      id: verification._id,
      blockchainId: submissionId,
      amount: verification.amount,
      status: verification.status,
      timestamp: verification.timestamp,
    },
  });
};

export const approveVerification = async (req: Request, res: Response) => {
  const { submissionId } = req.params;

  const submission = await VerificationSubmission.findById(submissionId);

  if (!submission) {
    return res.status(404).json({ error: "Verification submission not found" });
  }

  if (submission.status !== "pending") {
    return res.status(400).json({ error: "Submission is not pending" });
  }

  // Approve on blockchain
  try {
    const contract = getContract();
    await contract.approveVerification(
      submissionId,
      (req as any).user.walletAddress
    );
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }

  // Update MongoDB
  submission.status = "approved";
  submission.verifierId = (req as any).user._id;
  await submission.save();

  res.json({
    success: true,
    message: "Verification approved successfully",
    submission,
  });
};

export const rejectVerification = async (req: Request, res: Response) => {
  const { submissionId } = req.params;
  const { reason } = req.body;

  const submission = await VerificationSubmission.findById(submissionId);

  if (!submission) {
    return res.status(404).json({ error: "Verification submission not found" });
  }

  if (submission.status !== "pending") {
    return res.status(400).json({ error: "Submission is not pending" });
  }

  // Reject on blockchain
  try {
    const contract = getContract();
    await contract.rejectVerification(
      submissionId,
      (req as any).user.walletAddress
    );
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }

  // Update MongoDB
  submission.status = "rejected";
  submission.verifierId = (req as any).user._id;
  await submission.save();

  res.json({
    success: true,
    message: "Verification rejected successfully",
    submission,
  });
};

export const getVerificationSubmissions = async (
  req: Request,
  res: Response
) => {
  const { status, page = 1, limit = 10 } = req.query;
  const filter: any = {};

  if (status) filter.status = status;

  // Filter based on user role
  if ((req as any).user.role === "seller") {
    filter.sellerId = (req as any).user._id;
  } else if ((req as any).user.role === "verifier") {
    // Verifiers can see all pending submissions
    if (!status) filter.status = "pending";
  }

  const submissions = await VerificationSubmission.find(filter)
    .populate("sellerId", "name email walletAddress")
    .populate("verifierId", "organizationName")
    .select("-__v")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ timestamp: -1 });

  const total = await VerificationSubmission.countDocuments(filter);

  res.json({
    success: true,
    submissions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getVerificationById = async (req: Request, res: Response) => {
  const { submissionId } = req.params;

  const submission = await VerificationSubmission.findById(submissionId)
    .populate("sellerId", "name email walletAddress")
    .populate("verifierId", "organizationName")
    .select("-__v");

  if (!submission) {
    return res.status(404).json({ error: "Verification submission not found" });
  }

  // Check access permissions
  if (
    (req as any).user.role === "seller" &&
    submission.sellerId.toString() !== (req as any).user._id.toString()
  ) {
    return res.status(403).json({ error: "Access denied" });
  }

  res.json({
    success: true,
    submission,
  });
};

export const getPendingVerifications = async (req: Request, res: Response) => {
  const submissions = await VerificationSubmission.find({
    status: "pending",
  })
    .populate("sellerId", "name email walletAddress")
    .select("amount documents timestamp")
    .sort({ timestamp: 1 })
    .limit(50);

  res.json({
    success: true,
    submissions,
  });
};

export const getUserVerificationHistory = async (
  req: Request,
  res: Response
) => {
  const { page = 1, limit = 10 } = req.query;

  const submissions = await VerificationSubmission.find({
    sellerId: (req as any).user._id,
  })
    .populate("verifierId", "organizationName")
    .select("-__v")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ timestamp: -1 });

  const total = await VerificationSubmission.countDocuments({
    sellerId: (req as any).user._id,
  });

  res.json({
    success: true,
    submissions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};
