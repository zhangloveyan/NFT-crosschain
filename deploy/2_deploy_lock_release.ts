import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developementChains, networkConfig } from "../helper-hardhat-config";

const deployNFTPoolLockAndRelease: DeployFunction = async () => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("NFTPoolLockAndRelease 部署合约中。。。")

    let sourceRouter: string;
    let link: string;

    if (developementChains.includes(network.name)) {
        // 参数 address _router, address _link, address _nftAddr
        const ccipDeployment = await deployments.get("CCIPLocalSimulator");
        const ccip = await ethers.getContractAt("CCIPLocalSimulator", ccipDeployment.address);
        const ccipConfig = await ccip.configuration();
        sourceRouter = ccipConfig.sourceRouter_;
        link = ccipConfig.linkToken_;
    } else {
        const chainId = network.config.chainId as number;
        sourceRouter = networkConfig[chainId].router;
        link = networkConfig[chainId].linkToken;

    }

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