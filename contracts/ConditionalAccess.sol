// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ConditionalAccess {
    uint256 private _protectedField;

    modifier onlyEOA() {
        require(tx.origin == msg.sender, "Cannot be called from another contract");
        _;
    }

    function getProtectedField() onlyEOA public view returns (uint256) {

        return _protectedField;
    }

    function _getProtectedField() internal view returns (uint256) {
        return _protectedField;
    }

    function getProtectedFieldFromContract() external view returns (uint256) {
        return _getProtectedField();
    }

    function setProtectedField(uint256 value) public {
        _protectedField = value;
    }
}
