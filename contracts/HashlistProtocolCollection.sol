// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// modules
import {CuratedListCollection} from "./CuratedListCollection.sol";
import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {_LSP8_TOKENID_FORMAT_ADDRESS} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {LSP8Enumerable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/extensions/LSP8Enumerable.sol";

contract HashlistProtocolCollection is LSP8Enumerable {
    constructor(
        string memory nftProtocolName,
        string memory nftProtocolSymbol,
        address contractOwner,
        uint256 lsp4Type,
        bytes memory lsp4MetadataURI_
    )
        LSP8IdentifiableDigitalAsset(
            nftProtocolName,
            nftProtocolSymbol,
            contractOwner,
            lsp4Type,
            _LSP8_TOKENID_FORMAT_ADDRESS
        )
    {
        _setData(_LSP4_METADATA_KEY, lsp4MetadataURI_);
    }

    function mint(
        string memory curatedListName,
        string memory curatedListSymbol,
        address curator,
        bytes memory lsp4MetadataURIOfLSP8_
    ) public {
        CuratedListCollection curatedListAddress = new CuratedListCollection(
            curatedListName,
            curatedListSymbol,
            curator,
            2,
            lsp4MetadataURIOfLSP8_
        );
        _mint(
            curator,
            bytes32(uint256(uint160(address(curatedListAddress)))),
            true,
            ""
        );
    }
}
