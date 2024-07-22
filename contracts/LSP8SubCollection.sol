// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {LSP4DigitalAssetMetadata} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4DigitalAssetMetadata.sol";
import {_LSP4_SUPPORTED_STANDARDS_KEY, _LSP4_SUPPORTED_STANDARDS_VALUE, _LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {_LSP8_REFERENCE_CONTRACT} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP8_TOKENID_FORMAT_ADDRESS} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {LSP8Mintable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";

contract LSP8SubCollection is LSP8Mintable {
    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        uint256 lsp4TokenType_,
        bytes memory lsp4MetadataURI_,
        bytes32 customTokenId
    )
        LSP8Mintable(
            name_,
            symbol_,
            newOwner_,
            lsp4TokenType_,
            _LSP8_TOKENID_FORMAT_ADDRESS
        )
    {
        LSP4DigitalAssetMetadata._setData(
            _LSP8_REFERENCE_CONTRACT,
            abi.encodePacked( // todo????? what?
                    msg.sender,
                    bytes32(uint256(uint160(address(this))))
                )
        );
        _setData(_LSP4_METADATA_KEY, lsp4MetadataURI_);

        // mint all tokens to the receiver of the initial tokens
        // _mint(receiverOfInitialTokens_, totalSupply_, true, "");
        _mint(newOwner_, customTokenId, true, "");
    }

    // todo ein?????
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
}
