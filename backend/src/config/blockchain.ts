import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Ethereum testnet configuration
export const BLOCKCHAIN_CONFIG = {
  // Sepolia testnet
  RPC_URL:
    process.env.ETHEREUM_RPC_URL ||
    "https://sepolia.infura.io/v3/YOUR_PROJECT_ID",
  CHAIN_ID: 11155111, // Sepolia
  CONTRACT_ADDRESS: process.env.CONTRACT_ADDRESS || "",
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",

  // Gas settings
  GAS_LIMIT: 3000000,
  GAS_PRICE: ethers.utils.parseUnits("20", "gwei"),

  // Network settings
  CONFIRMATIONS: 2,
  TIMEOUT: 60000, // 60 seconds
};

// Provider and wallet setup
export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(BLOCKCHAIN_CONFIG.RPC_URL);
};

export const getWallet = () => {
  if (!BLOCKCHAIN_CONFIG.PRIVATE_KEY) {
    throw new Error("Private key not configured");
  }
  const provider = getProvider();
  return new ethers.Wallet(BLOCKCHAIN_CONFIG.PRIVATE_KEY, provider);
};

// Contract ABI (simplified for now)
export const CONTRACT_ABI = [
  // User management
  "function registerUser(address wallet, string role, string country, string[] documents) external",
  "function verifyUser(address wallet, bool verified) external",
  "function banUser(address wallet, bool banned) external",
  "function getUserData(address wallet) external view returns (tuple(address wallet, string role, string[] documents, string country, bool verified, bool banned, string[] badges))",

  // Verifier management
  "function registerVerifier(address wallet, string organizationName, string[] documents) external",
  "function startVerifierVote(address verifier) external",
  "function voteForVerifier(address verifier, bool support) external",
  "function isAdmin(address wallet) external view returns (bool)",

  // Verification
  "function submitVerification(uint256 amount, string[] documents) external returns (uint256)",
  "function approveVerification(uint256 submissionId, address verifier) external",
  "function rejectVerification(uint256 submissionId, address verifier) external",
  "function getVerificationSubmission(uint256 submissionId) external view returns (tuple(uint256 id, address seller, uint256 amount, string[] documents, address verifier, bool approved, bool rejected, uint256 timestamp))",

  // Token management
  "function transferToken(uint256 tokenId, address to) external",
  "function getTokenData(uint256 tokenId) external view returns (tuple(uint256 tokenId, address owner, uint256 amount, string[] documents, bool verified, uint256 timestamp, address producer))",
  "function ownerOf(uint256 tokenId) external view returns (address)",

  // Events
  "event TokenMinted(uint256 tokenId, address owner, uint256 amount)",
  "event TokenTransferred(uint256 tokenId, address from, address to)",
  "event UserRegistered(address wallet, string role)",
  "event UserVerified(address wallet, bool verified)",
  "event UserBanned(address wallet, bool banned)",
  "event VerifierRegistered(address wallet, string organizationName)",
  "event VerificationSubmitted(uint256 submissionId, address seller)",
  "event VerificationApproved(uint256 submissionId, address verifier)",
  "event VerificationRejected(uint256 submissionId, address verifier)",
];

// Contract instance
export const getContract = () => {
  const wallet = getWallet();
  return new ethers.Contract(
    BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS,
    CONTRACT_ABI,
    wallet
  );
};

// Helper functions
export const waitForTransaction = async (txHash: string) => {
  const provider = getProvider();
  const receipt = await provider.waitForTransaction(
    txHash,
    BLOCKCHAIN_CONFIG.CONFIRMATIONS
  );
  return receipt;
};

export const parseEther = (amount: string) => {
  return ethers.utils.parseEther(amount);
};

export const formatEther = (amount: ethers.BigNumber) => {
  return ethers.utils.formatEther(amount);
};

// Error handling
export class BlockchainError extends Error {
  constructor(
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "BlockchainError";
  }
}

export const handleBlockchainError = (error: any) => {
  if (error.code === "INSUFFICIENT_FUNDS") {
    throw new BlockchainError(
      "Insufficient funds for transaction",
      "INSUFFICIENT_FUNDS"
    );
  }
  if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
    throw new BlockchainError(
      "Transaction would fail",
      "UNPREDICTABLE_GAS_LIMIT"
    );
  }
  if (error.message.includes("user rejected")) {
    throw new BlockchainError("Transaction rejected by user", "USER_REJECTED");
  }
  throw new BlockchainError(
    error.message || "Blockchain transaction failed",
    "UNKNOWN"
  );
};
