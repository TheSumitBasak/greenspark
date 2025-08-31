import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/config/contract";

/**
 * Connect to MetaMask and get the signer
 */
export const connectWallet = async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed");
    }

    // Request account access
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (accounts.length === 0) {
      throw new Error("No accounts found");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();

    return { provider, signer, address: accounts[0] };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

/**
 * Get contract instance with signer
 */
export const getContract = (signer) => {
  return new ethers.Contract(
    CONTRACT_CONFIG.ADDRESS,
    CONTRACT_CONFIG.ABI,
    signer
  );
};

/**
 * Vote for a verifier
 */
export const voteForVerifier = async (signer, verifierAddress, support) => {
  try {
    const contract = getContract(signer);
    const tx = await contract.voteForVerifier(verifierAddress, support);
    const receipt = await tx.wait();
    return receipt;
  } catch (error) {
    console.error("Error voting for verifier:", error);
    throw error;
  }
};

/**
 * Get verifier data
 */
export const getVerifierData = async (signer, verifierAddress) => {
  try {
    const contract = getContract(signer);
    const data = await contract.getVerifierData(verifierAddress);
    return data;
  } catch (error) {
    console.error("Error getting verifier data:", error);
    throw error;
  }
};

/**
 * Check if user has voted for a verifier
 */
export const hasVoted = async (signer, verifierAddress, voterAddress) => {
  try {
    const contract = getContract(signer);
    const voted = await contract.hasVoted(verifierAddress, voterAddress);
    return voted;
  } catch (error) {
    console.error("Error checking vote status:", error);
    throw error;
  }
};

/**
 * Check if user can vote for a verifier
 */
export const canVote = async (signer, verifierAddress, voterAddress) => {
  try {
    const contract = getContract(signer);
    const canVote = await contract.canVote(verifierAddress, voterAddress);
    return canVote;
  } catch (error) {
    console.error("Error checking if can vote:", error);
    throw error;
  }
};

/**
 * Check if voting has started for a verifier
 */
export const isVoteStarted = async (signer, verifierAddress) => {
  try {
    const contract = getContract(signer);
    const started = await contract.isVoteStarted(verifierAddress);
    return started;
  } catch (error) {
    console.error("Error checking if vote started:", error);
    throw error;
  }
};

/**
 * Get all verifiers data from smart contract
 */
export const getAllVerifiers = async (signer) => {
  try {
    const contract = getContract(signer);

    // Add debugging
    console.log("Calling getAllVerifiers...");

    const data = await contract.getAllVerifiers();

    console.log("getAllVerifiers result:", data);

    // Check if we got valid data
    if (!data || !data.wallets || data.wallets.length === 0) {
      console.log("No verifiers found in contract");
      return [];
    }

    // Transform the returned arrays into verifier objects
    const verifiers = [];
    for (let i = 0; i < data.wallets.length; i++) {
      verifiers.push({
        address: data.wallets[i],
        organizationName: data.organizationNames[i],
        email: data.emails[i],
        active: data.active[i],
        banned: data.banned[i],
        voteStarted: data.voteStarted[i],
        yesVotes: Number(data.yesVotes[i]),
        noVotes: Number(data.noVotes[i]),
      });
    }

    console.log("Processed verifiers:", verifiers);
    return verifiers;
  } catch (error) {
    console.error("Error getting all verifiers:", error);
    throw error;
  }
};

/**
 * Get active voting verifiers from smart contract
 */
export const getActiveVotingVerifiers = async (signer) => {
  try {
    const contract = getContract(signer);
    const data = await contract.getActiveVotingVerifiers();

    // Transform the returned arrays into verifier objects
    const verifiers = [];
    for (let i = 0; i < data.wallets.length; i++) {
      verifiers.push({
        address: data.wallets[i],
        organizationName: data.organizationNames[i],
        email: data.emails[i],
        yesVotes: Number(data.yesVotes[i]),
        noVotes: Number(data.noVotes[i]),
        totalVotes: Number(data.totalVotes[i]),
        votesNeeded: Number(data.votesNeeded[i]),
        voteEnd: Number(data.voteEnds[i]),
      });
    }

    return verifiers;
  } catch (error) {
    console.error("Error getting active voting verifiers:", error);
    throw error;
  }
};

/**
 * Format error messages for user display
 */
export const formatContractError = (error) => {
  if (error.code === 4001) {
    return "Transaction was rejected by user";
  }

  if (error.message.includes("Already voted")) {
    return "You have already voted for this verifier";
  }

  if (error.message.includes("Voting period ended")) {
    return "Voting period has ended for this verifier";
  }

  if (error.message.includes("User must be verified")) {
    return "You must be a verified user to vote";
  }

  if (error.message.includes("Only registered users")) {
    return "Only registered users and verifiers can vote";
  }

  if (error.message.includes("User must be verified and not banned")) {
    return "You must be verified and not banned to vote";
  }

  if (error.message.includes("Verifier must be active and not banned")) {
    return "Verifier must be active and not banned to vote";
  }

  return "Failed to submit vote. Please try again.";
};

/**
 * Format address for display
 */
export const formatAddress = (address) => {
  if (!address) return "Unknown";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Convert timestamp to readable date
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return "Unknown";
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
};

/**
 * Check contract state and available functions
 */
export const checkContractState = async (signer) => {
  try {
    const contract = getContract(signer);

    console.log("Checking contract state...");

    // Check if contract has the required functions
    const hasGetAllVerifiers = typeof contract.getAllVerifiers === "function";
    const hasGetActiveVotingVerifiers =
      typeof contract.getActiveVotingVerifiers === "function";

    console.log("Contract functions available:");
    console.log("- getAllVerifiers:", hasGetAllVerifiers);
    console.log("- getActiveVotingVerifiers:", hasGetActiveVotingVerifiers);

    // Try to get verifier list length
    try {
      const verifierListLength = await contract.verifierList();
      console.log("Verifier list length:", verifierListLength);
    } catch (error) {
      console.log("Could not get verifier list length:", error.message);
    }

    return {
      hasGetAllVerifiers,
      hasGetActiveVotingVerifiers,
    };
  } catch (error) {
    console.error("Error checking contract state:", error);
    throw error;
  }
};

/**
 * Get user transaction history from smart contract
 */
export const getUserTransactionHistory = async (signer, userAddress) => {
  try {
    const contract = getContract(signer);

    console.log("Getting transaction history for:", userAddress);

    const data = await contract.getUserTransactionHistory(userAddress);

    console.log("Transaction history result:", data);

    // Check if we got valid data
    if (!data || !data.transactionIds || data.transactionIds.length === 0) {
      console.log("No transactions found for user");
      return [];
    }

    // Transform the returned arrays into transaction objects
    const transactions = [];
    for (let i = 0; i < data.transactionIds.length; i++) {
      transactions.push({
        id: Number(data.transactionIds[i]),
        from: data.fromAddresses[i],
        to: data.toAddresses[i],
        amount: Number(data.amounts[i]),
        type: data.transactionTypes[i],
        timestamp: Number(data.timestamps[i]),
        success: data.successStatuses[i],
        details: data.details[i],
      });
    }

    // Sort by timestamp (newest first)
    transactions.sort((a, b) => b.timestamp - a.timestamp);

    console.log("Processed transactions:", transactions);
    return transactions;
  } catch (error) {
    console.error("Error getting user transaction history:", error);
    throw error;
  }
};

/**
 * Get transaction details by ID
 */
export const getTransactionDetails = async (signer, transactionId) => {
  try {
    const contract = getContract(signer);
    const data = await contract.getTransaction(transactionId);

    return {
      id: Number(data.id),
      from: data.from,
      to: data.to,
      amount: Number(data.amount),
      type: data.transactionType,
      timestamp: Number(data.timestamp),
      success: data.success,
      details: data.details,
    };
  } catch (error) {
    console.error("Error getting transaction details:", error);
    throw error;
  }
};

/**
 * Get user transaction count
 */
export const getUserTransactionCount = async (signer, userAddress) => {
  try {
    const contract = getContract(signer);
    const count = await contract.getUserTransactionCount(userAddress);
    return Number(count);
  } catch (error) {
    console.error("Error getting user transaction count:", error);
    return 0;
  }
};

/**
 * Debug function to test contract connection and functions
 */
export const debugContractConnection = async (signer) => {
  try {
    const contract = getContract(signer);

    console.log("=== Contract Debug Info ===");
    console.log("Contract address:", CONTRACT_CONFIG.ADDRESS);
    console.log("Contract instance:", contract);

    // Check network connection
    const provider = signer.provider;
    if (provider) {
      try {
        const network = await provider.getNetwork();
        console.log("=== Network Info ===");
        console.log("Chain ID:", network.chainId);
        console.log("Network name:", network.name);

        // Check if we're on the expected network
        const expectedChainId = CONTRACT_CONFIG.NETWORKS.ganache.chainId;
        if (network.chainId === expectedChainId) {
          console.log("✅ Connected to Ganache local network (Chain ID: 1337)");
        } else {
          console.log(
            "❌ Wrong network! Expected Chain ID:",
            expectedChainId,
            "Got:",
            network.chainId
          );
          console.log("Please switch MetaMask to Ganache local network");
        }

        // Check if we can get the latest block
        try {
          const latestBlock = await provider.getBlockNumber();
          console.log("Latest block number:", latestBlock);
          console.log("✅ Network connection is working");
        } catch (error) {
          console.log("❌ Network connection failed:", error.message);
        }
      } catch (error) {
        console.log("❌ Could not get network info:", error.message);
      }
    }

    // Check if the function exists
    const hasFunction =
      typeof contract.getUserTransactionHistory === "function";
    console.log("getUserTransactionHistory function exists:", hasFunction);

    if (hasFunction) {
      // Try to get the function signature
      const functionFragment = contract.interface.getFunction(
        "getUserTransactionHistory"
      );
      console.log("Function fragment:", functionFragment);

      // Check if we can call it with a test address
      const testAddress = "0x0000000000000000000000000000000000000000";
      try {
        console.log("Testing call with zero address...");
        const result = await contract.getUserTransactionHistory(testAddress);
        console.log("Test call result:", result);
      } catch (error) {
        console.log("Test call error:", error.message);
        console.log("Error code:", error.code);
        console.log("Error args:", error.errorArgs);
      }
    }

    return { hasFunction };
  } catch (error) {
    console.error("Debug error:", error);
    throw error;
  }
};

/**
 * Check and switch to the correct network (Ganache local)
 */
export const checkAndSwitchNetwork = async () => {
  try {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed");
    }

    const expectedChainId = CONTRACT_CONFIG.NETWORKS.ganache.chainId;
    const expectedNetwork = CONTRACT_CONFIG.NETWORKS.ganache;

    // Get current chain ID
    const currentChainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    console.log("Current Chain ID:", currentChainId);
    console.log("Expected Chain ID:", expectedChainId);

    if (currentChainId === `0x${expectedChainId.toString(16)}`) {
      console.log("✅ Already connected to Ganache local network");
      return true;
    }

    console.log("❌ Wrong network detected. Attempting to switch...");

    try {
      // Try to switch to the correct network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${expectedChainId.toString(16)}` }],
      });
      console.log("✅ Successfully switched to Ganache local network");
      return true;
    } catch (switchError) {
      // If the network doesn't exist in MetaMask, add it
      if (switchError.code === 4902) {
        console.log(
          "Network not found in MetaMask. Adding Ganache local network..."
        );

        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${expectedChainId.toString(16)}`,
                chainName: expectedNetwork.name,
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: [expectedNetwork.rpcUrl],
                blockExplorerUrls: [],
              },
            ],
          });
          console.log("✅ Successfully added Ganache local network");
          return true;
        } catch (addError) {
          console.error("Failed to add network:", addError);
          throw new Error(`Failed to add Ganache network: ${addError.message}`);
        }
      } else {
        throw switchError;
      }
    }
  } catch (error) {
    console.error("Network switch error:", error);
    throw error;
  }
};
