import { deployments, ethers, getNamedAccounts, network } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { developementChains, networkConfig } from "../helper-hardhat-config";

const deployNFTPoolBurnAndMint: DeployFunction = async () => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("NFTPoolBurnAndMint 部署合约中。。。")

    let destRouter: string;
    let link: string;

    if (developementChains.includes(network.name)) {
        // 参数 address _router, address _link, address _nftAddr
        const ccipDeployment = await deployments.get("CCIPLocalSimulator");
        const ccip = await ethers.getContractAt("CCIPLocalSimulator", ccipDeployment.address);
        const ccipConfig = await ccip.configuration();
        destRouter = ccipConfig.destinationRouter_;
        link = ccipConfig.linkToken_;
    } else {
        const chainId = network.config.chainId as number;
        destRouter = networkConfig[chainId].router;
        link = networkConfig[chainId].linkToken;
    }

    const wnftDeployment = await deployments.get("WrappedMyToken");
    const wnftAddr = wnftDeployment.address;

    await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        log: true,
        args: [destRouter, link, wnftAddr]
    });

    log("NFTPoolBurnAndMint 部署完成");
}
export default deployNFTPoolBurnAndMint;
deployNFTPoolBurnAndMint.tags = ["destchain", "all"]