// // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {LSP4DigitalAssetMetadata} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4DigitalAssetMetadata.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {LSP8Enumerable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/extensions/LSP8Enumerable.sol";
import {_LSP8_REFERENCE_CONTRACT} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

contract CuratedListCollection is LSP8Enumerable {
    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        bytes memory lsp4MetadataURI_
    )
        LSP8IdentifiableDigitalAsset(
            name_,
            symbol_,
            newOwner_,
            2, // collection type
            2 //_LSP8_TOKENID_FORMAT_ADDRESS
        )
    {
        _setData(_LSP4_METADATA_KEY, lsp4MetadataURI_);
    }

    function _setData(
        bytes32 dataKey,
        bytes memory dataValue
    ) internal override {
        require(
            dataKey != _LSP8_REFERENCE_CONTRACT,
            "LSP8ReferenceContractNotEditable"
        );
        LSP4DigitalAssetMetadata._setData(dataKey, dataValue);
    }

    function mint(bytes32 addressOfEntry) public {
        // todo onlyOwner?
        _mint(owner(), addressOfEntry, true, "");
    }
}
