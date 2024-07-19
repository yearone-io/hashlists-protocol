// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

// modules
import {BasicLSP8} from "./BasicLSP8.sol";
import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {_LSP8_TOKENID_FORMAT_ADDRESS} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

contract BasicLSP8CollectionOfCollections is LSP8IdentifiableDigitalAsset {
    constructor(
        string memory nftCollectionName,
        string memory nftCollectionSymbol,
        address contractOwner,
        uint256 lsp4Type,
        bytes memory lsp4MetadataURI_
    )
        LSP8IdentifiableDigitalAsset(
            nftCollectionName,
            nftCollectionSymbol,
            contractOwner,
            lsp4Type,
            _LSP8_TOKENID_FORMAT_ADDRESS
        )
    {
        _setData(_LSP4_METADATA_KEY, lsp4MetadataURI_);
    }

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
