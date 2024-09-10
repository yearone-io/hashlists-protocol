# Hashlists Curation Protocol

### Getting Started

1. Run `nvm use` to se the correct node environment. [NVM Docs](https://github.com/nvm-sh/nvm/tree/master)
2. `npm i`
3. Fill out `/constants/network.ts`
4. Deploy protocol `npx hardhat run scripts/deployHashlistsProtocolCollection.ts --network luksoTestnet`

### Architecture: Leveraging the LSP8 Identifiable Digital Asset Standard

Protocol is made up of a core LSP8 collection called the "Hashlists Protocol Collection" (HashlistsProtocolCollection.sol), that then houses child collection beneath it. The child collections are user generated curated lists of addresses on a blockchain. 

The LUKSO Standard Proposal 8 (LSP8) Identifiable Digital Asset lends itself quite nicely to serving as the foundation for the Hashlists Curation Protocol. LSP8 was designed for creating unique, non-fungible tokens (NFTs), allowing for precise control over individual assets. This makes it an ideal choice for implementing curated lists, as each entity on the list is represented by its unique token ID, which can be mapped to a unique blockchain address. The key properties that Curated Hashlists inherit from LSP8 are:

- **Uniqueness of Assets:** Every entry in a curated list is unique. LSP8 provides a way to tokenize and manage these unique assets, representing anything from NFTs to smart contracts to digital profiles.
- **Trackable Provenance:** By using LSP8, curators can ensure that their lists are verifiable and tamper-proof. Each curated list’s origin, changes, and endorsements are transparent, traceable on the blockchain, and publicly verifiable.
- **Interoperability:** LSP8 assets can interact seamlessly with other LUKSO standards, such as LSP3 (profile metadata) and LSP9 (vaults), expanding the range of possible interactions within the ecosystem. For instance, curated lists could be integrated into other decentralized applications (dApps), social platforms, or even serve as modules in larger protocols.
- **Censorship Resistance:** Unlike centralized platforms where curated content can be manipulated or restricted, on-chain curated lists using LSP8 cannot be censored. This ensures that lists remain true to the curator's intent without interference.
- **Decentralized Ownership and Control:** Curated lists created via LSP8 allow full ownership and control by the individual curator. The list itself becomes a tokenized asset that can be transferred, sold, or shared, giving curators autonomy and direct rewards for their efforts.


### Integrate Curated Lists: On-chain and Off-chain

To refer to the contents of a curated list in your smart contract, you can simply rely on all the methods available under [LSP8IdentifiableDigitalAsset](https://github.com/lukso-network/LIPs/blob/main/LSPs/LSP-8-IdentifiableDigitalAsset.md) and its [Enumerable](https://github.com/lukso-network/lsp-smart-contracts/blob/develop/packages/lsp8-contracts/contracts/extensions/LSP8Enumerable.sol) extension, with the target address being the curated list's address on the blockchain.

- **Entry IDs in a Curated List:**  
  Entry IDs in a curated list are stored as `bytes32`. To check if a particular blockchain address is an entry within a curated list, first pad the address with 0s, and then rely on the `getOperatorsOf(tokenId)` method.

- **Fetching All Addresses in a List:**  
  If you want to read all the addresses of the entries in a list, you can fetch the `totalSupply()` and then, using that result and the `tokenAt(uint256 index)` method, fetch the address for the full set.

For a thorough overview of LUKSO's Standard Proposals check out: [https://docs.lukso.tech/](https://docs.lukso.tech/)





