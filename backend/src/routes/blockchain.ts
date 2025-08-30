import express, { Request, Response } from "express";
import blockchainService from "../services/blockchain";

const router = express.Router();

// Type definitions for request bodies
interface RegisterUserRequest {
  wallet: string;
  role: string;
  country: string;
  documents?: string[];
}

interface VerifyUserRequest {
  wallet: string;
  verified: boolean;
}

interface SubmitVerificationRequest {
  amount: number;
  documents: string[];
}

interface ApproveVerificationRequest {
  submissionId: number;
  verifier: string;
}

interface AddAdminRequest {
  admin: string;
}

// Get user data from blockchain
router.get("/user/:wallet", async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;
    const result = await blockchainService.getUserData(wallet);

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error: any) {
    console.error("Error getting user data:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Register user on blockchain
router.post(
  "/user/register",
  async (req: Request<{}, {}, RegisterUserRequest>, res: Response) => {
    try {
      const { wallet, role, country, documents } = req.body;

      if (!wallet || !role || !country) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: wallet, role, country",
        });
      }

      const result = await blockchainService.registerUser(
        wallet,
        role,
        country,
        documents || []
      );

      if (result.success) {
        res.json({
          success: true,
          hash: result.hash,
          message: "User registered successfully on blockchain",
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Error registering user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Verify user on blockchain
router.post(
  "/user/verify",
  async (req: Request<{}, {}, VerifyUserRequest>, res: Response) => {
    try {
      const { wallet, verified } = req.body;

      if (!wallet || typeof verified !== "boolean") {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: wallet, verified",
        });
      }

      const result = await blockchainService.verifyUser(wallet, verified);

      if (result.success) {
        res.json({
          success: true,
          hash: result.hash,
          message: `User ${verified ? "verified" : "unverified"} successfully`,
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Error verifying user:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Submit verification for tokens
router.post(
  "/verification/submit",
  async (req: Request<{}, {}, SubmitVerificationRequest>, res: Response) => {
    try {
      const { amount, documents } = req.body;

      if (!amount || !documents || !Array.isArray(documents)) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: amount, documents (array)",
        });
      }

      const result = await blockchainService.submitVerification(
        amount,
        documents
      );

      if (result.success) {
        res.json({
          success: true,
          hash: result.hash,
          message: "Verification submitted successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Error submitting verification:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Approve verification
router.post(
  "/verification/approve",
  async (req: Request<{}, {}, ApproveVerificationRequest>, res: Response) => {
    try {
      const { submissionId, verifier } = req.body;

      if (!submissionId || !verifier) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: submissionId, verifier",
        });
      }

      const result = await blockchainService.approveVerification(
        submissionId,
        verifier
      );

      if (result.success) {
        res.json({
          success: true,
          hash: result.hash,
          message: "Verification approved successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Error approving verification:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Get token data
router.get("/token/:tokenId", async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    const result = await blockchainService.getTokenData(parseInt(tokenId));

    if (result.success) {
      res.json({
        success: true,
        data: result.data,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error: any) {
    console.error("Error getting token data:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Check if user is admin
router.get("/admin/check/:wallet", async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;
    const result = await blockchainService.isAdmin(wallet);

    if (result.success) {
      res.json({
        success: true,
        isAdmin: result.isAdmin,
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error,
      });
    }
  } catch (error: any) {
    console.error("Error checking admin status:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Add admin
router.post(
  "/admin/add",
  async (req: Request<{}, {}, AddAdminRequest>, res: Response) => {
    try {
      const { admin } = req.body;

      if (!admin) {
        return res.status(400).json({
          success: false,
          error: "Missing required field: admin",
        });
      }

      const result = await blockchainService.addAdmin(admin);

      if (result.success) {
        res.json({
          success: true,
          hash: result.hash,
          message: "Admin added successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          error: result.error,
        });
      }
    } catch (error: any) {
      console.error("Error adding admin:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Get wallet balance
router.get("/balance/:wallet", async (req: Request, res: Response) => {
  try {
    const { wallet } = req.params;
    const balance = await blockchainService.getBalance(wallet);

    res.json({
      success: true,
      balance: balance,
      wallet: wallet,
    });
  } catch (error: any) {
    console.error("Error getting balance:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Health check for blockchain connection
router.get("/health", async (req: Request, res: Response) => {
  try {
    // Check if service is initialized
    if (!blockchainService.isInitialized()) {
      return res.status(503).json({
        success: false,
        error: "Blockchain service is not initialized yet",
        message: "Service is still starting up, please try again in a few seconds"
      });
    }

    const contract = blockchainService.getContract();
    const network = await contract.provider.getNetwork();

    res.json({
      success: true,
      message: "Blockchain service is healthy",
      network: {
        chainId: network.chainId,
        name: network.name,
      },
      contractAddress: contract.address,
      isInitialized: true
    });
  } catch (error: any) {
    console.error("Blockchain health check failed:", error);
    res.status(500).json({
      success: false,
      error: "Blockchain service is not healthy",
      details: error.message,
    });
  }
});

export default router;
