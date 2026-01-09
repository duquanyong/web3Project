import { expect } from "chai";
import hre from "hardhat";

describe("SimpleStorage", function () {
  it("Should store and retrieve a value", async function () {
    // 部署合约
    const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();

    // 调用 store 函数
    await simpleStorage.store(42);

    // 调用 retrieve 函数并断言结果
    const retrieved = await simpleStorage.retrieve();
    expect(retrieved).to.equal(42n); // BigInt
  });
});