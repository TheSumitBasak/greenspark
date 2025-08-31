// Test utility for verifier functionality
// This file demonstrates how to use the new smart contract functions

import { ethers } from "ethers";

/**
 * Example of how to test the new verifier functions
 * This would typically be used in a development environment
 */
export const testVerifierFunctions = async (signer) => {
  try {
    console.log("Testing verifier functions...");

    // Test getting all verifiers
    const allVerifiers = await getAllVerifiers(signer);
    console.log("All verifiers:", allVerifiers);

    // Test getting active voting verifiers
    const activeVotingVerifiers = await getActiveVotingVerifiers(signer);
    console.log("Active voting verifiers:", activeVotingVerifiers);

    return {
      allVerifiers,
      activeVotingVerifiers,
    };
  } catch (error) {
    console.error("Error testing verifier functions:", error);
    throw error;
  }
};

/**
 * Example of how to register a test verifier (admin only)
 */
export const registerTestVerifier = async (
  signer,
  verifierAddress,
  organizationName,
  email
) => {
  try {
    const contract = getContract(signer);
    const documents = ["test-document.pdf"];

    const tx = await contract.registerVerifier(
      verifierAddress,
      organizationName,
      email,
      documents
    );
    await tx.wait();

    console.log(`Verifier ${organizationName} registered successfully`);
    return tx;
  } catch (error) {
    console.error("Error registering verifier:", error);
    throw error;
  }
};

/**
 * Example of how to start voting for a verifier (admin only)
 */
export const startVotingForVerifier = async (signer, verifierAddress) => {
  try {
    const contract = getContract(signer);

    const tx = await contract.startVerifierVote(verifierAddress);
    await tx.wait();

    console.log(`Voting started for verifier ${verifierAddress}`);
    return tx;
  } catch (error) {
    console.error("Error starting verifier vote:", error);
    throw error;
  }
};

/**
 * Example of how to vote for a verifier
 */
export const testVoteForVerifier = async (signer, verifierAddress, support) => {
  try {
    const contract = getContract(signer);

    const tx = await contract.voteForVerifier(verifierAddress, support);
    await tx.wait();

    console.log(
      `Voted ${support ? "YES" : "NO"} for verifier ${verifierAddress}`
    );
    return tx;
  } catch (error) {
    console.error("Error voting for verifier:", error);
    throw error;
  }
};

// Note: These functions require the proper imports and contract setup
// They are provided as examples for testing the smart contract integration
