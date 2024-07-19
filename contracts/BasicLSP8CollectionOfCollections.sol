// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

// modules
import {LSP8Mintable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";
import {BasicLSP8} from "./BasicLSP8.sol";

contract BasicLSP8CollectionOfCollections is LSP8Mintable {
    constructor(
        string memory nftCollectionName,
        string memory nftCollectionSymbol,
        address contractOwner,
        uint256 lsp4Type,
        uint256 lsp8TokenIdFormat
    )
        LSP8Mintable(
            nftCollectionName,
            nftCollectionSymbol,
            contractOwner,
            lsp4Type,
            lsp8TokenIdFormat
        )
    {}

    function mint(
        string memory nameOfLSP8_,
        string memory symbolOfLSP8_,
        uint256 lsp4TokenType_,
        uint256 lsp8TokenIdFormat_,
        address receiver_
    ) public onlyOwner returns (address lsp8SubCollectionAddress) {
        // deploy the BasicLSP8 contract and set the address as tokenId
        BasicLSP8 lsp8SubCollection = new BasicLSP8(
            nameOfLSP8_,
            symbolOfLSP8_,
            address(this), // owner of the LSP8SubCollection is this contract (LSP8Collection contract)
            lsp4TokenType_,
            lsp8TokenIdFormat_
        );

        lsp8SubCollectionAddress = address(lsp8SubCollection);

        // convert the address of the LSP8SubCollection to bytes32 to use it as tokenId
        bytes32 tokenId = bytes32(uint256(uint160(lsp8SubCollectionAddress)));

        // mint the token for the LSP8SubCollection
        _mint(receiver_, tokenId, true, "");
    }
}
