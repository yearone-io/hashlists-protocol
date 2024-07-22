// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// modules
import {LSP8SubCollection} from "./LSP8SubCollection.sol";
import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {_LSP8_TOKENID_FORMAT_ADDRESS} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";

contract LSP8ParentCollection is LSP8IdentifiableDigitalAsset {
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
        address receiver_,
        bytes memory lsp4MetadataURIOfLSP8_,
        bytes32 customTokenId
    ) public onlyOwner returns (address) {
        LSP8SubCollection lsp8SubCollection = new LSP8SubCollection(
            nameOfLSP8_,
            symbolOfLSP8_,
            address(this), // owner of the LSP8SubCollection is this contract (LSP8Collection contract) ?? should it be this way??
            lsp4TokenType_,
            lsp4MetadataURIOfLSP8_,
            customTokenId
        );

        bytes32 tokenId = bytes32(uint256(uint160(address(lsp8SubCollection))));
        _mint(receiver_, tokenId, true, "");
    }
}
