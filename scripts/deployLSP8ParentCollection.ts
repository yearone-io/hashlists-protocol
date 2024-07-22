
import { ethers } from 'hardhat';
import { ERC725 } from '@erc725/erc725.js';
import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import lsp8CollectionMetadata from './metadata/lsp8CollectionMetadata.json';

const lsp8CollectionMetadataCID =
  'ipfs://QmcwYFhGP7KBo1a4EvbBxuvDf3jQ2bw1dfMEovATRJZetX';
const { NETWORK } = process.env;

async function main() {
  // get LSP8Collection contract factory
  const LSP8Collection = await ethers.getContractFactory('LSP8ParentCollection');

  // get the deployer address so we can assign ownership to it
  const [deployer] = await ethers.getSigners();

  // convert the lsp8CollectionMetadata to a verifiable uri
  const erc725 = new ERC725(LSP4DigitalAsset, '', '', {});
  const encodeMetadata = erc725.encodeData([
    {
      keyName: 'LSP4Metadata',
      value: {
        json: lsp8CollectionMetadata,
        url: lsp8CollectionMetadataCID,
      },
    },
  ]);

  const deploymentArguments = ['MyToken0',  'MT0', deployer.address, 2, encodeMetadata.values[0]];

  // deploy LSP8Collection contract
  const lsp8Collection = await LSP8Collection.deploy(
    'MyToken0',
    'MT0',
    // will be the owner of the LSP8Collection contract
    deployer.address,
    // lsp4TokenType is address - see https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-4-DigitalAsset-Metadata.md#lsp4tokentype
    2,
    // encoded metadata
    encodeMetadata.values[0],
    // {      
    //   gasLimit: 41_000_000n,
    // }
  );

  // wait until the contract is mined
  await lsp8Collection.waitForDeployment();

  // print contract address
  const address = await lsp8Collection.getAddress();
  console.log('LSP8Collection deployed to:', address);
  try {
    await hre.run("verify:verify", {
        address: lsp8Collection.target,
        network: NETWORK,
        constructorArguments: deploymentArguments,
        contract: "contracts/LSP8ParentCollection.sol:LSP8ParentCollection"
    });
    console.log("Contract verified");

    
} catch (error) {
    console.error("Contract verification failed:", error);
}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});