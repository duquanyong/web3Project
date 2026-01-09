// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private value;

    // 存储一个值
    function store(uint256 _value) public {
        value = _value;
    }

    // 读取存储的值
    function retrieve() public view returns (uint256) {
        return value;
    }
}