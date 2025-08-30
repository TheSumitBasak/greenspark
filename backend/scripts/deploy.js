const { ethers, network } = require("hardhat");

async function main() {
  console.log("Deploying Green Hydrogen Credit Token...");

  // Get the contract factory
  const GHCToken = await ethers.getContractFactory("GHCToken");

  // Deploy the contract
  const ghcToken = await GHCToken.deploy();

  // Wait for deployment to finish
  await ghcToken.deployed();

  console.log("GHCToken deployed to:", ghcToken.address);

  // Get the deployer signer
  const deployer = (await ethers.getSigners())[0];
  const deployerAddress = deployer.address;

  // Create admin user automatically
  console.log("\n👤 Creating admin user...");
  try {
    // Register the deployer as an admin user
    const userRole = "admin";
    const userCountry = "Global";
    const userDocuments = ["admin_verification.pdf"];

    const tx = await ghcToken.registerUser(
      deployerAddress,
      userRole,
      userCountry,
      userDocuments
    );
    await tx.wait();

    console.log("✅ Admin user created successfully!");
    console.log("Admin Address:", deployerAddress);
    console.log("Admin Role:", userRole);
    console.log("Transaction Hash:", tx.hash);
  } catch (error) {
    console.error("❌ Failed to create admin user:", error.message);
  }

  // Log deployment information
  console.log("\nDeployment Summary:");
  console.log("===================");
  console.log("Contract Name: Green Hydrogen Credit Token");
  console.log("Contract Address:", ghcToken.address);
  console.log("Network:", network.name);
  console.log("Deployer:", deployerAddress);

  // Save deployment info to a file
  const fs = require("fs");
  const deploymentInfo = {
    contractName: "GHCToken",
    contractAddress: ghcToken.address,
    network: network.name,
    deployer: deployerAddress,
    deploymentTime: new Date().toISOString(),
    abi: GHCToken.interface.format(),
    adminUser: {
      address: deployerAddress,
      role: "admin",
      country: "Global",
      documents: ["admin_verification.pdf"],
    },
  };

  fs.writeFileSync(
    "deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to: deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
