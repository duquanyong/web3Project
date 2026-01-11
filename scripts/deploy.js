import hre from "hardhat";

async function main() {
  // const Token = await hre.ethers.getContractFactory("MyToken");
  // const token = await Token.deploy();
  // await token.waitForDeployment();
  // console.log("Deployed to:", await token.getAddress());

  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  console.log("Deploying SimpleStorage...");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.waitForDeployment();
  const address = await simpleStorage.getAddress();
  console.log("✅ SimpleStorage deployed to:", address);
  // await fs.promises.writeFile(".contract.address", address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});