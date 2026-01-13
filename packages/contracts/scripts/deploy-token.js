// scripts/deploy-token.js
// LearnToken (LTK) deployed to: 0xB05FEeC3dD5f876c2E076B70B696e7D23435Fb57
import hre from "hardhat";

async function main() {
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const token = await MyToken.deploy();
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("✅ LearnToken (LTK) deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});