
import { ethers } from 'hardhat';
import { ERC725 } from '@erc725/erc725.js';
import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import HashlistCollectionMetadata from './metadata/HashlistsCollectionMetadata.json';
import CuratedListMetadata from './metadata/CuratedListMetadata.json';

const lsp8CollectionMetadataCID =
  'ipfs://QmcwYFhGP7KBo1a4EvbBxuvDf3jQ2bw1dfMEovATRJZetX';
const { NETWORK } = process.env;


async function main() {
  // get LSP8Collection contract factory
  const HashlistProtocolCollection = await ethers.getContractFactory('HashlistProtocolCollection');

  // get the deployer address so we can assign ownership to it
  const [deployer] = await ethers.getSigners();

  // convert the lsp8CollectionMetadata to a verifiable uri
  const erc725 = new ERC725(LSP4DigitalAsset, '', '', {});
  const encodeMetadata = erc725.encodeData([
    {
      keyName: 'LSP4Metadata',
      value: {
        json: HashlistCollectionMetadata,
        url: lsp8CollectionMetadataCID,
      },
    },
  ]);

  const deploymentArguments = ['LSP8 Parent',  'DAD', deployer.address, 2, encodeMetadata.values[0]];

  // deploy LSP8Collection contract
  const lsp8Collection = await HashlistProtocolCollection.deploy(
    'Hashlist Protocol Collection',
    'HPC',
    deployer.address,
    2,
    encodeMetadata.values[0],
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
        contract: "contracts/HashlistProtocolCollection.sol:HashlistProtocolCollection"
    });
    console.log("Contract verified");

    
} catch (error) {
    console.error("Contract verification failed:", error);
}
// now we mint
  // // convert the lsp4TokenMetadata to a verifiable uri
  const curatedListEncodeMetadata = erc725.encodeData([
    {
      keyName: 'LSP4Metadata',
      value: {
        json: CuratedListMetadata,
        url: lsp8CollectionMetadataCID,
      },
    },
  ])


const tx = await lsp8Collection.mint(
  'Curated list test',
  'CLT',
  deployer.address,
  curatedListEncodeMetadata.values[0],
);
await tx.wait();
  console.log('✅ Curated List deployed and protocol NFT minted. Tx:', tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});