// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {_LSP8_TOKENID_FORMAT_ADDRESS} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {LSP8Mintable} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/presets/LSP8Mintable.sol";

contract LSP8Collection is LSP8IdentifiableDigitalAsset {
    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        uint256 lsp4TokenType_,
        bytes memory lsp4MetadataURI_
    )
        LSP8IdentifiableDigitalAsset(
            name_,
            symbol_,
            newOwner_,
            lsp4TokenType_,
            _LSP8_TOKENID_FORMAT_ADDRESS
        )
    {
        // set the lsp4MetadataURI
        _setData(_LSP4_METADATA_KEY, lsp4MetadataURI_);
    }

    function mint(
        string memory nameOfLSP8_,
        string memory symbolOfLSP8_,
        address receiver_,
        uint256 lsp4TokenType_,
        bytes memory lsp4MetadataURI_
    ) public onlyOwner returns (address lsp8SubCollectionAddress) {
        // deploy the LSP8SubCollection and set the address as tokenId
        LSP8Mintable lsp8SubCollection = new LSP8Mintable(
            nameOfLSP8_,
            symbolOfLSP8_,
            address(this), // owner of the LSP8SubCollection is this contract (LSP8Collection contract)
            lsp4TokenType_,
            _LSP8_TOKENID_FORMAT_ADDRESS
        );

        lsp8SubCollectionAddress = address(lsp8SubCollection);

        // // Mint the initial token to the receiver
        lsp8SubCollection.mint(receiver_, bytes32(uint256(1)), true, "");

        // // Set the metadata URI for the newly deployed LSP8
        // lsp8SubCollection._setData(_LSP4_METADATA_KEY, lsp4MetadataURI_);

        // // convert the address of the LSP8SubCollection to bytes32 to use it as tokenId
        bytes32 tokenId = bytes32(uint256(uint160(lsp8SubCollectionAddress)));

        // /*
        //   owner of the tokenId is this contract
        //   tokenId is the address of the newly deployed LSP8SubCollection
        //   force is true since here the owner of the tokenId is this contract
        //   data is empty
        // */
        _mint(address(this), tokenId, true, "");
    }

    // override the _setDataForTokenId function to set the data on the LSP8SubCollection itself
    function _setDataForTokenId(
        bytes32 tokenId,
        bytes32 dataKey,
        bytes memory dataValue
    ) internal override {
        // setData on the LSP8SubCollection
        LSP8Mintable(payable(address(uint160(uint256(tokenId))))).setData(
            dataKey,
            dataValue
        );

        emit TokenIdDataChanged(tokenId, dataKey, dataValue);
    }

    // override the _getDataForTokenId function to get the data from the LSP8SubCollection itself
    function _getDataForTokenId(
        bytes32 tokenId,
        bytes32 dataKey
    ) internal view override returns (bytes memory dataValues) {
        return
            LSP8Mintable(payable(address(uint160(uint256(tokenId))))).getData(
                dataKey
            );
    }
}
