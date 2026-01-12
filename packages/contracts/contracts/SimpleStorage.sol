// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private value;

    // 存储一个值
    function store(uint256 _value) public {
        uint256 oldValue = value; // 保存旧值
        value = _value;
        emit ValueChanged(oldValue, _value); // 👈 触发事件
    }

    // 读取存储的值
    function retrieve() public view returns (uint256) {
        return value;
    }

    function increment() public {
        uint256 oldValue = value; // 保存旧值
        value += 1;
        emit ValueChanged(oldValue, value); // 👈 触发事件
    }

    event ValueChanged(uint256 indexed oldValue, uint256 newValue);
}