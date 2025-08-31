// Test utility for generating sample transactions
import { getContract } from "./contractUtils";

/**
 * Generate test transactions by performing sample operations
 * This helps populate the dashboard with real data
 */
export const generateTestTransactions = async (signer) => {
  try {
    const contract = getContract(signer);
    const address = signer.getAddress();

    console.log("Generating test transactions for:", address);

    // Check if user is admin
    const isAdmin = await contract.isAdmin(address);
    if (!isAdmin) {
      console.log("User is not admin, cannot generate test transactions");
      return false;
    }

    // Register a test user and verifier to create transactions
    const testUserAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
    const testVerifierAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";

    try {
      // Register test user
      console.log("Registering test user...");
      await contract.registerUser(testUserAddress, "seller", "United States", [
        "passport.pdf",
        "license.pdf",
      ]);
      console.log("✅ Test user registered");

      // Verify test user
      console.log("Verifying test user...");
      await contract.verifyUser(testUserAddress, true);
      console.log("✅ Test user verified");

      // Register test verifier
      console.log("Registering test verifier...");
      await contract.registerVerifier(
        testVerifierAddress,
        "Test Verification Corp",
        "test@verification.com",
        ["business_license.pdf", "insurance.pdf"]
      );
      console.log("✅ Test verifier registered");

      // Submit verification
      console.log("Submitting verification...");
      const submissionId = await contract.submitVerification(
        1000, // 1000 GHC tokens
        ["production_report.pdf", "emissions_data.pdf"]
      );
      console.log("✅ Verification submitted, ID:", submissionId.toString());

      // Start voting for verifier
      console.log("Starting verifier vote...");
      await contract.startVerifierVote(testVerifierAddress);
      console.log("✅ Verifier vote started");

      // Vote for verifier
      console.log("Voting for verifier...");
      await contract.voteForVerifier(testVerifierAddress, true);
      console.log("✅ Voted for verifier");

      // Approve verification (as verifier)
      console.log("Approving verification...");
      await contract.approveVerification(submissionId, testVerifierAddress);
      console.log("✅ Verification approved");

      console.log("🎉 Test transactions generated successfully!");
      return true;
    } catch (error) {
      console.log(
        "Some operations failed (this is normal if they already exist):",
        error.message
      );
      return true; // Return true as some operations might already exist
    }
  } catch (error) {
    console.error("Error generating test transactions:", error);
    return false;
  }
};

/**
 * Check if user has any transactions
 */
export const checkUserTransactions = async (signer, userAddress) => {
  try {
    const contract = getContract(signer);
    const count = await contract.getUserTransactionCount(userAddress);
    console.log(`User ${userAddress} has ${count} transactions`);
    return Number(count);
  } catch (error) {
    console.error("Error checking user transactions:", error);
    return 0;
  }
};
