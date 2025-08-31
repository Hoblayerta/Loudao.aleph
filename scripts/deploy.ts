import { ethers } from "hardhat";

async function main() {
  console.log("Deploying LouDaoReports contract...");

  const LouDaoReports = await ethers.getContractFactory("LouDaoReports");
  const contract = await LouDaoReports.deploy();

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log(`LouDaoReports deployed to: ${contractAddress}`);
  console.log(`Network: Lisk Sepolia (Chain ID: 4202)`);
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: "liskSepolia",
    chainId: 4202,
    deployer: (await ethers.getSigners())[0].address,
    timestamp: new Date().toISOString()
  };

  console.log("Deployment info:", deploymentInfo);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
