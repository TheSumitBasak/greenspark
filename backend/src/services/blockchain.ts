import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

// Type definitions
interface UserData {
  wallet: string;
  role: string;
  documents: string[];
  country: string;
  verified: boolean;
  banned: boolean;
  badges: string[];
}

interface TokenData {
  tokenId: string;
  owner: string;
  amount: string;
  documents: string[];
  verified: boolean;
  timestamp: string;
  producer: string;
}

interface BlockchainResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  hash?: string;
  receipt?: any;
  isAdmin?: boolean;
}

class BlockchainService {
  private provider: ethers.providers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;
  private wallet: ethers.Wallet | null = null;

  constructor() {
    // Initialize asynchronously without blocking
    this.initialize().catch((error) => {
      console.error("Failed to initialize blockchain service:", error);
      // Don't throw here, let the service handle initialization failures gracefully
    });
  }

  private async initialize(): Promise<void> {
    try {
      const rpcUrl = process.env.GANACHE_RPC_URL || "http://127.0.0.1:7545";
      const contractAddress =
        process.env.CONTRACT_ADDRESS ||
        "0x5FbDB2315678afecb367f032d93F642f64180aa3";
      const privateKey = process.env.PRIVATE_KEY;

      this.provider = new ethers.providers.JsonRpcProvider(rpcUrl);

      if (privateKey) {
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        console.log("Backend wallet initialized:", this.wallet.address);
      }

      // Contract ABI - simplified for backend
      const CONTRACT_ABI = [
        "function registerUser(address wallet, string role, string country, string[] documents)",
        "function getUserData(address wallet) view returns (tuple(address wallet, string role, string[] documents, string country, bool verified, bool banned, string[] badges))",
        "function verifyUser(address wallet, bool verified)",
        "function submitVerification(uint256 amount, string[] documents) returns (uint256)",
        "function approveVerification(uint256 submissionId, address verifier)",
        "function getTokenData(uint256 tokenId) view returns (tuple(uint256 tokenId, address owner, uint256 amount, string[] documents, bool verified, uint256 timestamp, address producer))",
        "function isAdmin(address wallet) view returns (bool)",
        "function addAdmin(address admin)",
      ];

      this.contract = new ethers.Contract(
        contractAddress,
        CONTRACT_ABI,
        this.provider
      );

      console.log("Blockchain service initialized successfully");
    } catch (error) {
      console.error("Failed to initialize blockchain service:", error);
      throw error;
    }
  }

  public getContract(): ethers.Contract {
    if (!this.contract) {
      throw new Error("Contract not initialized");
    }
    return this.contract;
  }

  public isInitialized(): boolean {
    return this.contract !== null && this.provider !== null;
  }

  public async retryInitialization(): Promise<boolean> {
    try {
      await this.initialize();
      return true;
    } catch (error) {
      console.error("Retry initialization failed:", error);
      return false;
    }
  }

  private getContractWithSigner(): ethers.Contract {
    if (!this.wallet) {
      throw new Error(
        "Wallet not initialized. Please set PRIVATE_KEY in environment variables."
      );
    }
    return this.contract!.connect(this.wallet);
  }

  // User Management
  async registerUser(
    wallet: string,
    role: string,
    country: string,
    documents: string[]
  ): Promise<BlockchainResult> {
    try {
      const contract = this.getContractWithSigner();
      const tx = await contract.registerUser(wallet, role, country, documents);
      const receipt = await tx.wait();

      return {
        success: true,
        hash: tx.hash,
        receipt: receipt,
      };
    } catch (error: any) {
      console.error("Error registering user:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getUserData(wallet: string): Promise<BlockchainResult<UserData>> {
    try {
      const contract = this.getContract();
      const userData = await contract.getUserData(wallet);

      return {
        success: true,
        data: {
          wallet: userData.wallet,
          role: userData.role,
          documents: userData.documents,
          country: userData.country,
          verified: userData.verified,
          banned: userData.banned,
          badges: userData.badges,
        },
      };
    } catch (error: any) {
      console.error("Error getting user data:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async verifyUser(
    wallet: string,
    verified: boolean
  ): Promise<BlockchainResult> {
    try {
      const contract = this.getContractWithSigner();
      const tx = await contract.verifyUser(wallet, verified);
      const receipt = await tx.wait();

      return {
        success: true,
        hash: tx.hash,
        receipt: receipt,
      };
    } catch (error: any) {
      console.error("Error verifying user:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Token Management
  async submitVerification(
    amount: number,
    documents: string[]
  ): Promise<BlockchainResult> {
    try {
      const contract = this.getContractWithSigner();
      const tx = await contract.submitVerification(amount, documents);
      const receipt = await tx.wait();

      return {
        success: true,
        hash: tx.hash,
        receipt: receipt,
      };
    } catch (error: any) {
      console.error("Error submitting verification:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async approveVerification(
    submissionId: number,
    verifier: string
  ): Promise<BlockchainResult> {
    try {
      const contract = this.getContractWithSigner();
      const tx = await contract.approveVerification(submissionId, verifier);
      const receipt = await tx.wait();

      return {
        success: true,
        hash: tx.hash,
        receipt: receipt,
      };
    } catch (error: any) {
      console.error("Error approving verification:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async getTokenData(tokenId: number): Promise<BlockchainResult<TokenData>> {
    try {
      const contract = this.getContract();
      const tokenData = await contract.getTokenData(tokenId);

      return {
        success: true,
        data: {
          tokenId: tokenData.tokenId.toString(),
          owner: tokenData.owner,
          amount: tokenData.amount.toString(),
          documents: tokenData.documents,
          verified: tokenData.verified,
          timestamp: tokenData.timestamp.toString(),
          producer: tokenData.producer,
        },
      };
    } catch (error: any) {
      console.error("Error getting token data:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Admin Functions
  async addAdmin(admin: string): Promise<BlockchainResult> {
    try {
      const contract = this.getContractWithSigner();
      const tx = await contract.addAdmin(admin);
      const receipt = await tx.wait();

      return {
        success: true,
        hash: tx.hash,
        receipt: receipt,
      };
    } catch (error: any) {
      console.error("Error adding admin:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async isAdmin(wallet: string): Promise<BlockchainResult> {
    try {
      const contract = this.getContract();
      const isAdmin = await contract.isAdmin(wallet);

      return {
        success: true,
        isAdmin: isAdmin,
      };
    } catch (error: any) {
      console.error("Error checking admin status:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Utility Functions
  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider!.getBalance(address);
      return ethers.utils.formatEther(balance);
    } catch (error: any) {
      console.error("Error getting balance:", error);
      return "0";
    }
  }
}

const blockchainService = new BlockchainService();

export default blockchainService;
