// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "./BasicLSP8.sol";

contract LSP8Proxy {
    // Event to emit the address of the newly deployed BasicLSP8 contract
    event NewLSP8Deployed(address indexed newLSP8Address);

    // Function to deploy a new BasicLSP8 contract
    function deployNewLSP8(
        string memory nftCollectionName,
        string memory nftCollectionSymbol,
        address contractOwner,
        uint256 lsp4Type,
        uint256 lsp8TokenIdFormat
    ) public {
        // Deploy a new BasicLSP8 contract using the create opcode
        BasicLSP8 newLSP8 = new BasicLSP8(
            nftCollectionName,
            nftCollectionSymbol,
            contractOwner,
            lsp4Type,
            lsp8TokenIdFormat
        );

        // Emit the NewLSP8Deployed event with the address of the newly deployed contract
        emit NewLSP8Deployed(address(newLSP8));
    }
}
