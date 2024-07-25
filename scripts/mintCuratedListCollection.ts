import { ethers } from 'hardhat';

const curatedListCollectionContract =
  '0xA9E1F2999Dd7B429E564c64b4c5055FA62b2F8AA';

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