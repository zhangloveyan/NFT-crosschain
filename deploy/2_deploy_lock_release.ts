import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";

const deployNFTPoolLockAndRelease: DeployFunction = async () => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("NFTPoolLockAndRelease 部署合约中。。。")

    // 参数 address _router, address _link, address _nftAddr
    const ccipDeployment = await deployments.get("CCIPLocalSimulator");
    const ccip = await ethers.getContractAt("CCIPLocalSimulator", ccipDeployment.address);
    const ccipConfig = await ccip.configuration();
    const sourceRouter = ccipConfig.sourceRouter_;
    const link = ccipConfig.linkToken_;

    const nftDeployment = await deployments.get("MyToken");
    // const nft = await ethers.getContractAt("MyToken", nftDeployment.address)
    const nftAddr = nftDeployment.address;

    await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        log: true,
        args: [sourceRouter, link, nftAddr]
    });

    log("NFTPoolLockAndRelease 部署完成");
}

export default deployNFTPoolLockAndRelease;
deployNFTPoolLockAndRelease.tags = ["sourcechain", "all"]