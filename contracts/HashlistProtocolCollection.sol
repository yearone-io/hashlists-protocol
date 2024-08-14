// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Import the library and other modules
import {CuratedListLibrary} from "./CuratedListLibrary.sol";
import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {LSP8Enumerable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/extensions/LSP8Enumerable.sol";
import {_LSP8_TOKENID_FORMAT_ADDRESS} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";

contract HashlistProtocolCollection is LSP8Enumerable {
    // Define the event
    event CuratedListCreated(address indexed curatedListAddress);

    constructor(
        string memory nftProtocolName,
        string memory nftProtocolSymbol,
        address contractOwner,
        bytes memory lsp4MetadataURI_
    )
        LSP8IdentifiableDigitalAsset(
            nftProtocolName,
            nftProtocolSymbol,
            contractOwner,
            2, // collection type
            _LSP8_TOKENID_FORMAT_ADDRESS
        )
    {
        _setData(_LSP4_METADATA_KEY, lsp4MetadataURI_);
    }

    function mint(
        string memory curatedListName,
        string memory curatedListSymbol,
        address curator,
        bytes memory lsp4MetadataURIOfLSP8
    ) public {
        address curatedListAddress = CuratedListLibrary.deployCuratedList(
            curatedListName,
            curatedListSymbol,
            curator,
            lsp4MetadataURIOfLSP8
        );

        // Emit the event with the address of the newly deployed contract
        emit CuratedListCreated(curatedListAddress);

        _mint(curator, bytes32(uint256(uint160(curatedListAddress))), true, "");
    }
}
