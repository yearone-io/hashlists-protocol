// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ConditionalAccess.sol";

contract TestContract {
    ConditionalAccess private _conditionalAccess;

    constructor(address conditionalAccessAddress) {
        _conditionalAccess = ConditionalAccess(conditionalAccessAddress);
    }

    function callGetProtectedField() public view returns (uint256) {
        return _conditionalAccess.getProtectedField();
    }

    function callGetProtectedFieldFromContract() public view returns (uint256) {
        return _conditionalAccess.getProtectedFieldFromContract();
    }
}
