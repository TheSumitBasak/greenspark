const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying AdminContract...");

  // Get the contract factory
  const AdminContract = await ethers.getContractFactory("AdminContract");

  // Deploy the contract
  const adminContract = await AdminContract.deploy();

  // Wait for deployment to finish
  await adminContract.deployed();

  console.log("AdminContract deployed to:", adminContract.address);

  // Get deployer address
  const [deployer] = await ethers.getSigners();
  console.log("Deployed by:", deployer.address);

  // Verify the contract is owned by deployer
  const owner = await adminContract.owner();
  console.log("Contract owner:", owner);

  // Check if deployer is admin
  const isAdmin = await adminContract.admins(deployer.address);
  console.log("Deployer is admin:", isAdmin);

  // Get initial counts
  const verifierCount = await adminContract.getVerifierCount();
  const voteSessionCount = await adminContract.getVoteSessionCount();
  const adminCount = await adminContract.adminCount();

  console.log("Initial verifier count:", verifierCount.toString());
  console.log("Initial vote session count:", voteSessionCount.toString());
  console.log("Initial admin count:", adminCount.toString());

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
