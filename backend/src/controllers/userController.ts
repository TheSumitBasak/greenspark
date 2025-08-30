import { Request, Response } from "express";
import { User } from "../models";
import { generateToken } from "../middleware/auth";
import { getContract, handleBlockchainError } from "../config/blockchain";

export const registerUser = async (req: Request, res: Response) => {
  const { role, name, email, walletAddress, country, documents, userStatus } =
    req.body;

  // Validate required fields
  if (!role || !name || !email || !walletAddress || !country) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (!["buyer", "seller"].includes(role)) {
    return res
      .status(400)
      .json({ error: "Invalid role. Must be 'buyer' or 'seller'" });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { walletAddress }],
  });

  if (existingUser) {
    return res.status(400).json({
      error: "User already exist",
    });
  }

  // Create user in MongoDB
  const user = new User({
    role,
    name,
    email,
    walletAddress,
    documents: documents || [],
    country,
    status: "pending",
    badges: [],
  });

  await user.save();

  // Register user on blockchain
  try {
    const contract = getContract();
  } catch (blockchainError) {
    // If blockchain fails, delete the MongoDB record
    await User.findByIdAndDelete(user._id);
    throw handleBlockchainError(blockchainError);
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      walletAddress: user.walletAddress,
      status: user.status,
      country: user.country,
    },
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const { status, role, page = 1, limit = 10 } = req.query;
  const filter: any = {};

  if (status) filter.status = status;
  if (role) filter.role = role;

  const users = await User.find(filter)
    .select("-__v")
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit))
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
};

export const verifyUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { verified } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update MongoDB
  user.status = verified ? "verified" : "rejected";
  await user.save();

  // Update blockchain
  if (verified) {
    try {
      const contract = getContract();
      await contract.registerUser(
        user.walletAddress,
        user.role,
        user.country,
        user.documents || []
      );
      await contract.verifyUser(user.walletAddress, verified);
    } catch (blockchainError) {
      throw handleBlockchainError(blockchainError);
    }
  } else {
    await User.deleteOne({ walletAddress: user.walletAddress });
  }

  res.json({
    success: true,
    message: `User ${verified ? "verified" : "rejected"} successfully`,
    user,
  });
};

export const banUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { banned } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Update MongoDB
  user.status = banned ? "banned" : "pending";
  await user.save();

  // Update blockchain
  try {
    const contract = getContract();
    await contract.banUser(user.walletAddress, banned);
  } catch (blockchainError) {
    throw handleBlockchainError(blockchainError);
  }

  res.json({
    success: true,
    message: `User ${banned ? "banned" : "unbanned"} successfully`,
    user,
  });
};

export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select(
    "name role status country badges"
  );

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.json({
    success: true,
    user,
  });
};
