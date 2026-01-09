import { ethers } from "hardhat";

async function main() {
  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy();
  await token.waitForDeployment();
  console.log("Deployed to:", await token.getAddress());
}

main().catch(console.error);