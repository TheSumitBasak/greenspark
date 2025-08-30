import { Request, Response } from "express";
import { User, Verifier } from "../models";
import { generateToken } from "../middleware/auth";

export const loginUser = async (req: Request, res: Response) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      error: "Wallet address required",
    });
  }

  try {
    // Check if user exists in any of the collections
    const [user, verifier] = await Promise.all([
      User.findOne({ walletAddress }),
      Verifier.findOne({ walletAddress }),
    ]);

    let userData: any = null;
    let userType: string = "";
    if (user) {
      if (user.status === "pending") {
        return res.status(403).json({
          success: false,
          error: "User is not verified yet!",
        });
      }
      if (user.status === "banned") {
        return res.status(403).json({
          success: false,
          error: "User is banned",
        });
      }
      userData = {
        id: user._id,
        type: "user",
        role: user.role,
        name: user.name,
        email: user.email,
        walletAddress: user.walletAddress,
        status: user.status,
        country: user.country,
        badges: user.badges,
        documents: user.documents,
      };
      userType = "user";
    } else if (verifier) {
      if (verifier.status === "banned") {
        return res.status(403).json({
          success: false,
          error: "Verifier is banned",
        });
      }
      userData = {
        id: verifier._id,
        type: "verifier",
        organizationName: verifier.organizationName,
        walletAddress: verifier.walletAddress,
        status: verifier.status,
        documents: verifier.documents,
      };
      userType = "verifier";
    } else if (walletAddress == process.env.CONTRACT_ADDRESS?.toLowerCase()) {
      userData = {
        id: "ADMIN",
        type: "admin",
        name: "admin",
        email: "admin@gmail.com",
        walletAddress: walletAddress,
        status: "verifed",
      };
      userType = "admin";
    } else {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Generate JWT token with user type information
    const token = generateToken({
      userId: userData.id.toString(),
      walletAddress: userData.walletAddress,
      role: userType,
      userType: userType,
      email: userData.email || null,
    });

    res.json({
      success: true,
      message: "Login successful",
      user: userData,
      token,
      userType,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const { user } = req as any;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated",
      });
    }

    // Return user data based on the authenticated user
    res.json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
