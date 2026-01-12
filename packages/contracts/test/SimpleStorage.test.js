// test/SimpleStorage.test.js
import { expect } from "chai";
import hre from "hardhat";

const { ethers } = hre;

describe("SimpleStorage", function () {
  let simpleStorage;

  beforeEach(async function () {
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment(); // ethers v6
  });

  it("Should start with a value of 0", async function () {
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue).to.equal(0n);
  });

  it("Should update the stored value when store() is called", async function () {
    const newValue = 42n;
    await simpleStorage.store(newValue);
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue).to.equal(newValue);
  });

  it("Should overwrite the value on subsequent store() calls", async function () {
    await simpleStorage.store(100n);
    await simpleStorage.store(200n);
    const currentValue = await simpleStorage.retrieve();
    expect(currentValue).to.equal(200n);
  });

  it("Should return the same value for all users", async function () {
    const [_, user1, user2] = await ethers.getSigners();
    await simpleStorage.store(999n);

    const simpleStorageAsUser1 = simpleStorage.connect(user1);
    const simpleStorageAsUser2 = simpleStorage.connect(user2);

    const val1 = await simpleStorageAsUser1.retrieve();
    const val2 = await simpleStorageAsUser2.retrieve();

    expect(val1).to.equal(999n);
    expect(val2).to.equal(999n);
  });
});