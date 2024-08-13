import { expect } from "chai";
import { ethers } from "hardhat";
import { ConditionalAccess__factory, TestContract__factory } from "../typechain-types/factories/contracts";
import { ConditionalAccess, TestContract } from "../typechain-types/contracts";

describe("ConditionalAccess", function() {
  let conditionalAccess: ConditionalAccess;
  let testContract: TestContract;

  beforeEach(async function() {
    const ConditionalAccess = (await ethers.getContractFactory("ConditionalAccess")) as ConditionalAccess__factory;
    conditionalAccess = await ConditionalAccess.deploy();
    await conditionalAccess.waitForDeployment();

    // Deploy the TestContract with the address of the deployed ConditionalAccess contract
    const TestContract = await ethers.getContractFactory("TestContract") as TestContract__factory;
    testContract = await TestContract.deploy(conditionalAccess.target);
    await testContract.waitForDeployment();
  });

  it("should allow external calls to getProtectedField", async function() {
    await conditionalAccess.setProtectedField(42);

    // Call getProtectedField externally
    const protectedField = await conditionalAccess.getProtectedField();
    expect(protectedField).to.equal(42);
  });

  it("should not allow contract calls to getProtectedField", async function() {
    await conditionalAccess.setProtectedField(42);

    // Try to call getProtectedField via the test contract and expect a revert
    await expect(testContract.callGetProtectedField()).to.be.revertedWith("Cannot be called from another contract");
  });

  it("should allow contract calls to getProtectedFieldFromContract", async function() {
    await conditionalAccess.setProtectedField(42);

    // Call getProtectedFieldFromContract via the test contract
    const protectedFieldFromContract = await testContract.callGetProtectedFieldFromContract();
    expect(protectedFieldFromContract).to.equal(42);
  });
});
