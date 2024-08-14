import { ethers } from 'hardhat';

const curatedListCollectionContract =
  '0x0F46f73d49CB5d50ab7EE002dC751F3808e20529';

async function main() {

  const curatedListcontract = await ethers.getContractAt(
    'CuratedListCollection',
    curatedListCollectionContract,
  );

  const addressOfEntryId = '0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809';
  const tx = await curatedListcontract.mint(
    "0x9F6bCab8d8d4403c4b78e96BB19b882E1E0fE947",
    addressOfEntryId,
    true,
    "0x",
    {
      gasLimit: 500000,
    }
  );

  await tx.wait();
  console.log('✅ Curated List NFT minted. Tx:', tx.hash);
  // todo _setDataForTokenId

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});