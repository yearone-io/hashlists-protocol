import { ethers } from 'hardhat';

const curatedListCollectionContract =
  '0xDaC6b300A741f9A4Abff58B2C43F2D66f007c156';

async function main() {
  // get LSP8Collection contract
  const curatedListcontract = await ethers.getContractAt(
    'CuratedListCollection',
    curatedListCollectionContract,
  );

  const addressOfEntryId = '0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809';
  const tx = await curatedListcontract.mint(
    addressOfEntryId    
  );

  await tx.wait();
  console.log('✅ Curated List NFT minted. Tx:', tx.hash);
  // todo _setDataForTokenId

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});