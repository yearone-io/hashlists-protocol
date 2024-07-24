import { ethers } from 'hardhat';

const curatedListCollectionContract =
  '0x54031b6bCb3a6C9a0cceD054A6aD46c28967a819';

async function main() {

  const curatedListcontract = await ethers.getContractAt(
    'CuratedListCollection',
    curatedListCollectionContract,
  );

  const addressOfEntryId = '0x1a2b3c4d5e6f708192a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f809';
  const tx = await curatedListcontract.mint(
    addressOfEntryId,
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