// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import {LSP8IdentifiableDigitalAsset} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";
import {_LSP8_TOKENID_FORMAT_ADDRESS} from "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8Constants.sol";
import {_LSP4_METADATA_KEY} from "@lukso/lsp-smart-contracts/contracts/LSP4DigitalAssetMetadata/LSP4Constants.sol";
import {LSP7SubCollection} from "./LSP7SubCollection.sol";

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
        string memory nameOfLSP7_,
        string memory symbolOfLSP7_,
        uint256 lsp4TokenType_,
        bool isNonDivisible_,
        uint256 totalSupplyOfLSP7_,
        address receiverOfInitialTokens_,
        bytes memory lsp4MetadataURIOfLSP7_
    ) public onlyOwner returns (address lsp7SubCollectionAddress) {
        // deploy the LSP7SubCollection and set the address as tokenId
        LSP7SubCollection lsp7SubCollection = new LSP7SubCollection(
            nameOfLSP7_,
            symbolOfLSP7_,
            address(this), // owner of the LSP7SubCollection is this contract (LSP8Collection contract)
            receiverOfInitialTokens_,
            lsp4TokenType_,
            isNonDivisible_,
            totalSupplyOfLSP7_,
            lsp4MetadataURIOfLSP7_
        );

        lsp7SubCollectionAddress = address(lsp7SubCollection);

        // convert the address of the LSP7SubCollection to bytes32 to use it as tokenId
        bytes32 tokenId = bytes32(uint256(uint160(lsp7SubCollectionAddress)));

        /*
          owner of the tokenId is this contract
          tokenId is the address of the newly deployed LSP7SubCollection
          force is true since here the owner of the tokenId is this contract
          data is empty
        */
        _mint(address(this), tokenId, true, "");
    }

    // override the _setDataForTokenId function to set the data on the LSP7SubCollection itself
    function _setDataForTokenId(
        bytes32 tokenId,
        bytes32 dataKey,
        bytes memory dataValue
    ) internal override {
        // setData on the LSP7SubCollection
        LSP7SubCollection(payable(address(uint160(uint256(tokenId))))).setData(
            dataKey,
            dataValue
        );

        emit TokenIdDataChanged(tokenId, dataKey, dataValue);
    }

    // override the _getDataForTokenId function to get the data from the LSP7SubCollection itself
    function _getDataForTokenId(
        bytes32 tokenId,
        bytes32 dataKey
    ) internal view override returns (bytes memory dataValues) {
        return
            LSP7SubCollection(payable(address(uint160(uint256(tokenId)))))
                .getData(dataKey);
    }
}
