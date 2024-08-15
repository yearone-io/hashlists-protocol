import { ethers } from 'hardhat';
const { NETWORK } = process.env;

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const CuratedListCollection = await ethers.getContractFactory("CuratedListCollection");
    const name = "YourTokenName";
    const symbol = "YTN";
    const creator = deployer.address;
    const lsp4MetadataURI = "0x"; // example: hex"0123456789abcdef"
  
    const curatedListCollection = await CuratedListCollection.deploy(name, symbol, creator, lsp4MetadataURI);
    await curatedListCollection.waitForDeployment();
    console.log('✅ CuratedListCollection deployed to:', curatedListCollection.target);
    // Verify the contract after deployment
    try {
      await hre.run("verify:verify", {
        address: curatedListCollection.target,
        network: NETWORK,
        constructorArguments: [name, symbol, creator, lsp4MetadataURI],
        contract: "contracts/CuratedListCollection.sol:CuratedListCollection"
      });
      console.log("Contract verified!");
    } catch (err) {
      console.error("Verification failed:", err);
    }
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  