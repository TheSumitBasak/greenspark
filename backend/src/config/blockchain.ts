import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Ethereum configuration
export const BLOCKCHAIN_CONFIG = {
  // Ganache local network
  RPC_URL: process.env.ETHEREUM_RPC_URL || "http://127.0.0.1:7545",
  CHAIN_ID: 1337, // Ganache
  CONTRACT_ADDRESS:
    process.env.CONTRACT_ADDRESS ||
    "0xf59212C3aCA5aB43bee6891002611D4082B4AceE",
  PRIVATE_KEY:
    process.env.PRIVATE_KEY ||
    "0x9cbdf42b700d43f8fbcdcb4987798572ec6424a6af6aaa5e19cf82cc434770d6",

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
  "function registerVerifier(address wallet, string organizationName, string email, string[] documents) external",
  "function startVerifierVote(address verifier) external",
  "function voteForVerifier(address verifier, bool support) external",
  "function isAdmin(address wallet) external view returns (bool)",
  "function addAdmin(address admin) external",
  "function admins(address) external view returns (bool)",
  "function MIN_VOTES_FOR_APPROVAL() external view returns (uint256)",
  "function VOTE_DURATION() external view returns (uint256)",
  "function getAllVerifiers() external view returns (address[] wallets, string[] organizationNames, string[] emails, bool[] active, bool[] banned, bool[] voteStarted, uint256[] yesVotes, uint256[] noVotes)",
  "function getVerifierData(address verifier) external view returns (address wallet, string organizationName, string email, bool active, bool banned, bool voteStarted, uint256 voteStart, uint256 voteEnd, uint256 yesVotes, uint256 noVotes)",
  "function getActiveVotingVerifiers() external view returns (address[] wallets, string[] organizationNames, string[] emails, uint256[] yesVotes, uint256[] noVotes, uint256[] totalVotes, uint256[] votesNeeded, uint256[] voteEnds)",
  "function hasVoted(address verifier, address voter) external view returns (bool)",
  "function canVote(address verifier, address voter) external view returns (bool)",
  "function isVoteStarted(address verifier) external view returns (bool)",

  // Verification
  "function submitVerification(uint256 amount, string[] documents) external returns (uint256)",
  "function approveVerification(uint256 submissionId, address verifier) external",
  "function rejectVerification(uint256 submissionId, address verifier) external",
  "function getVerificationSubmission(uint256 submissionId) external view returns (tuple(uint256 id, address seller, uint256 amount, string[] documents, address verifier, bool approved, bool rejected, uint256 timestamp))",
  "function getUserTransactionHistory(address user) external view returns (uint256[] transactionIds, address[] fromAddresses, address[] toAddresses, uint256[] amounts, string[] transactionTypes, uint256[] timestamps, bool[] successStatuses, string[] details)",
  "function getTransaction(uint256 transactionId) external view returns (uint256 id, address from, address to, uint256 amount, string transactionType, uint256 timestamp, bool success, string details)",
  "function getUserTransactionCount(address user) external view returns (uint256)",

  // Token management
  "function transferToken(uint256 tokenId, address to) external",
  "function getTokenData(uint256 tokenId) external view returns (tuple(uint256 tokenId, address owner, uint256 amount, string[] documents, bool verified, uint256 timestamp, address producer))",
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function approve(address to, uint256 tokenId) external",
  "function getApproved(uint256 tokenId) external view returns (address)",
  "function setApprovalForAll(address operator, bool approved) external",
  "function isApprovedForAll(address owner, address operator) external view returns (bool)",
  "function transferFrom(address from, address to, uint256 tokenId) external",
  "function safeTransferFrom(address from, address to, uint256 tokenId) external",

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
  "event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId)",
  "event ApprovalForAll(address indexed owner, address indexed operator, bool approved)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  "event TransactionRecorded(uint256 transactionId, address from, address to, uint256 amount, string transactionType)",
];

// Contract instance
export const getContract = () => {
  if (!BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS) {
    throw new Error("Contract address not configured");
  }

  try {
    const wallet = getWallet();
    const contract = new ethers.Contract(
      BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      wallet
    );

    // Verify the contract has the required methods
    if (typeof contract.getAllVerifiers !== "function") {
      console.warn("Warning: Contract does not have getAllVerifiers method");
    }

    return contract;
  } catch (error: any) {
    console.error("Error creating contract instance:", error);
    throw new BlockchainError(
      `Failed to create contract instance: ${error.message || "Unknown error"}`,
      "CONTRACT_INSTANCE_ERROR"
    );
  }
};

// Helper functions
export const waitForTransaction = async (txHash: string) => {
  const provider = await getProvider();
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

// Check if contract is deployed and accessible
export const checkContractDeployment = async () => {
  try {
    const provider = getProvider();
    const code = await provider.getCode(BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS);
    if (code === "0x") {
      throw new BlockchainError(
        "No contract deployed at the specified address",
        "CONTRACT_NOT_DEPLOYED"
      );
    }

    console.log("✅ Contract is deployed and accessible");
    return true;
  } catch (error: any) {
    console.error("❌ Contract deployment check failed:", error.message);
    throw new BlockchainError(
      `Contract deployment check failed: ${error.message}`,
      "CONTRACT_CHECK_ERROR"
    );
  }
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
