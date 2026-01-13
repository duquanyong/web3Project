import hre from "hardhat";
import fs from "fs/promises";

async function main() {
  // 部署 MyToken 合约（如果存在）
  try {
    const MyToken = await hre.ethers.getContractFactory("MyToken");
    console.log("Deploying MyToken...");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    const tokenAddress = await myToken.getAddress();
    console.log("✅ MyToken deployed to:", tokenAddress);
    
    // 将合约地址保存到文件
    await fs.promises.writeFile(".token.contract.address", tokenAddress);
  } catch (error) {
    console.log("ℹ️ MyToken contract not found or deployment skipped:", error.message);
  }

  // 部署 SimpleStorage 合约
  try {
    const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
    console.log("Deploying SimpleStorage...");
    const simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();
    const address = await simpleStorage.getAddress();
    console.log("✅ SimpleStorage deployed to:", address);
    
    // 将合约地址保存到文件
    await fs.promises.writeFile(".simplestorage.contract.address", address);
  } catch (error) {
    console.error("❌ SimpleStorage deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });