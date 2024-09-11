import hre, { ethers } from 'hardhat';
import { getNetworkAccountsConfig } from '../constants/network';

const network = hre.network.name;
console.log('network: ', network);
const { WALLET_ADDRESS, UP_ADDR_CONTROLLED_BY_EOA } = getNetworkAccountsConfig(network as string);

async function main() {
    const deployer = UP_ADDR_CONTROLLED_BY_EOA || WALLET_ADDRESS;
  
    console.log("Deploying contracts with the account:", deployer);
  
    const CuratedListCollection = await ethers.getContractFactory("CuratedListCollection");
    const name = "TEST";
    const symbol = "TST";
    const creator = deployer;
    const lsp4MetadataURI = "0x"; // example: hex"0123456789abcdef"
    // @ts-ignore
    const curatedListCollection = await CuratedListCollection.deploy(name, symbol, creator, lsp4MetadataURI);
    await curatedListCollection.waitForDeployment();
    console.log('✅ CuratedListCollection deployed to:', curatedListCollection.target);
    // Verify the contract after deployment
    try {
      await hre.run("verify:verify", {
        address: curatedListCollection.target,
        network: network,
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
  