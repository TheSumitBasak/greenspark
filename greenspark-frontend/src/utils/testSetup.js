// Test setup utility for registering verifiers
import { ethers } from "ethers";
import { getContract } from "./contractUtils";

/**
 * Register test verifiers (admin only)
 * This function helps you set up test data
 */
export const registerTestVerifiers = async (signer) => {
  try {
    const contract = getContract(signer);

    console.log("Registering test verifiers...");

    // Test verifier data
    const testVerifiers = [
      {
        address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat account 1
        organizationName: "Green Energy Verifiers Inc",
        email: "contact@greenenergyverifiers.com",
        documents: ["license.pdf", "certification.pdf"],
      },
      {
        address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", // Hardhat account 2
        organizationName: "Solar Verification Services",
        email: "info@solarverification.com",
        documents: ["business_license.pdf", "insurance.pdf"],
      },
      {
        address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", // Hardhat account 3
        organizationName: "Wind Power Certifiers",
        email: "admin@windpowercertifiers.com",
        documents: ["accreditation.pdf", "team_certifications.pdf"],
      },
    ];

    for (const verifier of testVerifiers) {
      try {
        console.log(`Registering verifier: ${verifier.organizationName}`);
        const tx = await contract.registerVerifier(
          verifier.address,
          verifier.organizationName,
          verifier.email,
          verifier.documents
        );
        await tx.wait();
        console.log(`✅ Registered: ${verifier.organizationName}`);
      } catch (error) {
        console.log(
          `❌ Failed to register ${verifier.organizationName}:`,
          error.message
        );
      }
    }

    console.log("Test verifier registration complete!");
  } catch (error) {
    console.error("Error registering test verifiers:", error);
    throw error;
  }
};

/**
 * Start voting for test verifiers (admin only)
 */
export const startVotingForTestVerifiers = async (signer) => {
  try {
    const contract = getContract(signer);

    console.log("Starting voting for test verifiers...");

    const testAddresses = [
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
      "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    ];

    for (const address of testAddresses) {
      try {
        console.log(`Starting vote for: ${address}`);
        const tx = await contract.startVerifierVote(address);
        await tx.wait();
        console.log(`✅ Started voting for: ${address}`);
      } catch (error) {
        console.log(`❌ Failed to start voting for ${address}:`, error.message);
      }
    }

    console.log("Test voting setup complete!");
  } catch (error) {
    console.error("Error starting test voting:", error);
    throw error;
  }
};

/**
 * Check if current user is admin
 */
export const checkIfAdmin = async (signer) => {
  try {
    const contract = getContract(signer);
    const address = signer.getAddress();
    const isAdmin = await contract.isAdmin(address);

    console.log(`Current address: ${address}`);
    console.log(`Is admin: ${isAdmin}`);

    return isAdmin;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Complete test setup (register verifiers and start voting)
 */
export const runCompleteTestSetup = async (signer) => {
  try {
    console.log("🚀 Running complete test setup...");

    // Check if user is admin
    const isAdmin = await checkIfAdmin(signer);
    if (!isAdmin) {
      console.log(
        "❌ Current user is not an admin. Cannot register verifiers."
      );
      return false;
    }

    // Register test verifiers
    await registerTestVerifiers(signer);

    // Start voting for them
    await startVotingForTestVerifiers(signer);

    console.log(
      "✅ Test setup complete! You should now see verifiers in the voting page."
    );
    return true;
  } catch (error) {
    console.error("Error in test setup:", error);
    return false;
  }
};
