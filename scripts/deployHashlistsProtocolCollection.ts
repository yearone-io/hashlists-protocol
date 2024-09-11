import hre, { ethers } from 'hardhat';
import { ERC725 } from '@erc725/erc725.js';
import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import CuratedListMetadata from './metadata/CuratedListMetadata.json';
import { getNetworkAccountsConfig } from '../constants/network';

const lsp8CollectionMetadataCID = 'ipfs://QmcwYFhGP7KBo1a4EvbBxuvDf3jQ2bw1dfMEovATRJZetX';

const network = hre.network.name;
console.log('network: ', network);
const { WALLET_ADDRESS, UP_ADDR_CONTROLLED_BY_EOA } = getNetworkAccountsConfig(network as string);

async function main() {
  // Deploy the CuratedListLibrary first
  const CuratedListLibraryFactory = await ethers.getContractFactory('CuratedListLibrary');
  const curatedListLibrary = await CuratedListLibraryFactory.deploy();
  await curatedListLibrary.waitForDeployment();
  console.log('✅ CuratedListLibrary deployed to:', curatedListLibrary.target);

  try {
    await hre.run("verify:verify", {
      address: curatedListLibrary.target,
      network,
      constructorArguments: [],
      contract: "contracts/CuratedListLibrary.sol:CuratedListLibrary"
    });
    console.log("Contract verified");

  } catch (error) {
    console.error("Contract verification failed:", error);
  }


  // get LSP8Collection contract factory
  const HashlistsProtocolCollectionFactory = await ethers.getContractFactory('HashlistsProtocolCollection', {
    libraries: {
      CuratedListLibrary: curatedListLibrary.target,
    },
  });

  const curator = UP_ADDR_CONTROLLED_BY_EOA || WALLET_ADDRESS;

  // convert the lsp8CollectionMetadata to a verifiable uri
  const erc725 = new ERC725(LSP4DigitalAsset, '', '', {});


  const deploymentArguments = ['Hashlists Curation Protocol', 'HCP', curator];

  // deploy LSP8Collection contract
  const hashlistsContract = await HashlistsProtocolCollectionFactory.deploy(
    'Hashlists Curation Protocol',
    'HCP',
    curator
  );

  // wait until the contract is mined
  await hashlistsContract.waitForDeployment();

  // print contract address
  const address = await hashlistsContract.getAddress();
  console.log('✅ Hashlist Protocol deployed to:', address);

  try {
    await hre.run("verify:verify", {
      address: hashlistsContract.target,
      network,
      constructorArguments: deploymentArguments,
      contract: "contracts/HashlistsProtocolCollection.sol:HashlistsProtocolCollection"
    });
    console.log("Contract verified");

  } catch (error) {
    console.error("Contract verification failed:", error);
  }

  ///////////////////////////
  // 🎨 Optional Minting time 🖼️
  ///////////////////////////
  return;
  console.log('✨ Minting new NFT...');
  const curatedListEncodeMetadata = erc725.encodeData([
    {
      keyName: 'LSP4Metadata',
      value: {
        json: CuratedListMetadata,
        url: lsp8CollectionMetadataCID,
      },
    },
  ]);

  const tx = await hashlistsContract.mint(
    'Curated list test',
    'CLT',
    curator,
    curatedListEncodeMetadata.values[0],
  );
  const receipt = await tx.wait();
  console.log('✅ Curated List deployed and protocol NFT minted. Tx:', tx.hash);

  const curatedListCreatedEvent = receipt.logs?.find(event => event.fragment.name === 'CuratedListCreated'); // todo not quite getting it
  if (curatedListCreatedEvent) {
    console.log('🎉 CuratedListCreated event found in the transaction receipt.');
    
    const curatedListAddress = curatedListCreatedEvent.args[0]
    console.log('🪙 Curated List Collection deployed to:', curatedListAddress);


    const a = [    'Curated list test',
    'CLT',
    curator,
    curatedListEncodeMetadata.values[0],]
  
    try {
      await hre.run("verify:verify", {
        address: curatedListAddress,
        network: NETWORK,
        constructorArguments: a,
        contract: "contracts/CuratedListCollection.sol:CuratedListCollection"
      });
      console.log("Contract verified");
  
    } catch (error) {
      console.error("Contract verification failed:", error);
    }

  } else {
    console.log('CuratedListCreated event not found in the transaction receipt.');
  }



}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});