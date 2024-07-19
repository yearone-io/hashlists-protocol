import { ethers } from 'hardhat';
import { ERC725 } from '@erc725/erc725.js';
import lsp7SubCollectionMetadata from './metadata/lsp7SubCollectionMetadata.json';
import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

const lsp8CollectionContractAddress =
  '0xA962b72095F7ec4b46fF195392B014E45Fd4a4dC';
const lsp7SubCollectionName = 'KLxENDLESS MEDALLION Purple';
const lsp7SubCollectionSymbol = 'KLxENDLESS MEDALLION';
const lsp7SubCollectionType = 2;
const lsp7SubCollectionIsNonDivisible = true; // decimals will be 0
const lsp7SubCollectionSupply = 50;
const lsp7SubCollectionMetadataCID =
  'ipfs://QmXrrkZwfKWK4yqaagoKPHhH148oXLgWoncFuh5d8ugsQL';

async function main() {
  // get LSP8Collection contract
  const lsp8CollectionContract = await ethers.getContractAt(
    'LSP8Collection',
    lsp8CollectionContractAddress,
  );

  // convert the lsp4TokenMetadata to a verifiable uri
  const erc725 = new ERC725(LSP4DigitalAsset, '', '', {});
  const encodedMetadata = erc725.encodeData(
    [
      {
        keyName: 'LSP4Metadata',
        value: {
          json: lsp7SubCollectionMetadata,
          url: lsp7SubCollectionMetadataCID,
        },
      },
    ],
    [],
  );

  // get deployer to set it as original receiver of the minted tokens
  const [deployer] = await ethers.getSigners();

  // get LSP7SubCollection contract address
  const lsp7ContractAddress = await lsp8CollectionContract.mint.staticCall(
    lsp7SubCollectionName,
    lsp7SubCollectionSymbol,
    lsp7SubCollectionType,
    lsp7SubCollectionIsNonDivisible,
    lsp7SubCollectionSupply,
    deployer.address,
    encodedMetadata.values[0],
  );

  // mint LSP7SubCollection
  const tx = await lsp8CollectionContract.mint(
    lsp7SubCollectionName,
    lsp7SubCollectionSymbol,
    lsp7SubCollectionType,
    lsp7SubCollectionIsNonDivisible,
    lsp7SubCollectionSupply,
    deployer.address,
    encodedMetadata.values[0],
  );

  await tx.wait();

  console.log('LSP7SubCollection deployed to:', lsp7ContractAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});