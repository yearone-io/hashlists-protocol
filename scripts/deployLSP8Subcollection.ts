import { ethers } from 'hardhat';
import { ERC725 } from '@erc725/erc725.js';
import lsp8CollectionMetadata from './metadata/lsp8CollectionMetadata.json';
import LSP4DigitalAsset from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json';

const lsp8CollectionContractAddress =
  '0x826775a8C6cd5d5A02CC9beFCbAe2a01847dc09d';
const lsp8SubCollectionName = 'KLxENDLESS MEDALLION Purple';
const lsp8SubCollectionSymbol = 'KLxENDLESS MEDALLION';
const lsp8SubCollectionType = 2;
const lsp8SubCollectionMetadataCID =
  'ipfs://QmXrrkZwfKWK4yqaagoKPHhH148oXLgWoncFuh5d8ugsQL';
  const receiver = '0x7DdEE8C820536c75cD0b47a92de22Df75C131838';
const customTokenId = '0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809';
const lsp8CollectionMetadataCID =
  'ipfs://QmcwYFhGP7KBo1a4EvbBxuvDf3jQ2bw1dfMEovATRJZetX';
async function main() {
  // get LSP8Collection contract
  const lsp8CollectionContract = await ethers.getContractAt(
    'LSP8ParentCollection',
    lsp8CollectionContractAddress,
  );

  // convert the lsp4TokenMetadata to a verifiable uri
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

  // get deployer to set it as original receiver of the minted tokens
  const [deployer] = await ethers.getSigners();

  const lsp8ContractAddress = await lsp8CollectionContract.mint.staticCall(
    lsp8SubCollectionName,
    lsp8SubCollectionSymbol,
    lsp8SubCollectionType,
    receiver,
    encodeMetadata.values[0],
    customTokenId
  );

  // mint LSP8SubCollection
  const tx = await lsp8CollectionContract.mint(
    lsp8SubCollectionName,
    lsp8SubCollectionSymbol,
    lsp8SubCollectionType,
    receiver,
    encodeMetadata.values[0],
    customTokenId
  );

  await tx.wait();
  console.log('metadatavalues:', encodeMetadata.values[0]);
  console.log('✅ LSP8SubCollection minted. Tx:', tx.hash);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});