// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import {CuratedListCollection} from "./CuratedListCollection.sol";

library CuratedListLibrary {
    function deployCuratedList(
        string memory curatedListName,
        string memory curatedListSymbol,
        address curator,
        bytes memory lsp4MetadataURIOfLSP8
    ) external returns (address) {
        CuratedListCollection curatedListAddress = new CuratedListCollection(
            curatedListName,
            curatedListSymbol,
            curator,
            lsp4MetadataURIOfLSP8
        );
        return address(curatedListAddress);
    }
}
