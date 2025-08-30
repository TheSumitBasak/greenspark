const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GHCToken", function () {
  let ghcToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const GHCToken = await ethers.getContractFactory("GHCToken");
    ghcToken = await GHCToken.deploy();
    await ghcToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await ghcToken.owner()).to.equal(owner.address);
    });

    it("Should have correct name and symbol", async function () {
      expect(await ghcToken.name()).to.equal("Green Hydrogen Credit");
      expect(await ghcToken.symbol()).to.equal("GHC");
    });
  });

  describe("User Registration", function () {
    it("Should allow admin to register users", async function () {
      await ghcToken.registerUser(addr1.address, "buyer", "USA", [
        "document1",
        "document2",
      ]);

      const user = await ghcToken.users(addr1.address);
      expect(user.wallet).to.equal(addr1.address);
      expect(user.role).to.equal("buyer");
      expect(user.country).to.equal("USA");
    });

    it("Should emit UserRegistered event", async function () {
      await expect(
        ghcToken.registerUser(addr1.address, "seller", "Canada", ["document1"])
      )
        .to.emit(ghcToken, "UserRegistered")
        .withArgs(addr1.address, "seller");
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to add admin", async function () {
      await ghcToken.addAdmin(addr1.address);
      expect(await ghcToken.admins(addr1.address)).to.be.true;
    });

    it("Should allow admin to verify users", async function () {
      await ghcToken.registerUser(addr1.address, "buyer", "USA", ["document1"]);
      await ghcToken.verifyUser(addr1.address, true);

      const user = await ghcToken.users(addr1.address);
      expect(user.verified).to.be.true;
    });
  });
});
