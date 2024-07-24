import { ethers } from 'hardhat';
import { ERC725 } from '@erc725/erc725.js';
import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';
import HashlistCollectionMetadata from './metadata/HashlistsCollectionMetadata.json';
import CuratedListMetadata from './metadata/CuratedListMetadata.json';
import { getNetworkAccountsConfig } from '../constants/network';

const lsp8CollectionMetadataCID = 'ipfs://QmcwYFhGP7KBo1a4EvbBxuvDf3jQ2bw1dfMEovATRJZetX';
const { NETWORK } = process.env;

async function main() {
  // Deploy the CuratedListLibrary first
  const CuratedListLibraryFactory = await ethers.getContractFactory('CuratedListLibrary');
  const curatedListLibrary = await CuratedListLibraryFactory.deploy();
  await curatedListLibrary.waitForDeployment();
  console.log('✅ CuratedListLibrary deployed to:', curatedListLibrary.target);

  // get LSP8Collection contract factory
  const HashlistProtocolCollectionFactory = await ethers.getContractFactory('HashlistProtocolCollection', {
    libraries: {
      CuratedListLibrary: curatedListLibrary.target,
    },
  });

  const curator = getNetworkAccountsConfig(NETWORK as string).UP_ADDR_CONTROLLED_BY_EOA;

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

  const deploymentArguments = ['Hashlist protocol collection', 'HPC', curator, encodeMetadata.values[0]];

  // deploy LSP8Collection contract
  const hashlistContract = await HashlistProtocolCollectionFactory.deploy(
    'Hashlist Protocol Collection',
    'HPC',
    curator,
    encodeMetadata.values[0],
  );

  // wait until the contract is mined
  await hashlistContract.waitForDeployment();

  // print contract address
  const address = await hashlistContract.getAddress();
  console.log('✅ Hashlist Protocol deployed to:', address);

  try {
    await hre.run("verify:verify", {
      address: hashlistContract.target,
      network: NETWORK,
      constructorArguments: deploymentArguments,
      contract: "contracts/HashlistProtocolCollection.sol:HashlistProtocolCollection"
    });
    console.log("Contract verified");

  } catch (error) {
    console.error("Contract verification failed:", error);
  }

  ///////////////////////////
  // 🎨 Minting time 🖼️
  ///////////////////////////
  
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

  const tx = await hashlistContract.mint(
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