import { deployments, ethers, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
const deployNFTPoolBurnAndMint: DeployFunction = async () => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("NFTPoolBurnAndMint 部署合约中。。。")

    // 参数 address _router, address _link, address _nftAddr
    const ccipDeployment = await deployments.get("CCIPLocalSimulator");
    const ccip = await ethers.getContractAt("CCIPLocalSimulator", ccipDeployment.address);
    const ccipConfig = await ccip.configuration();
    const destRouter = ccipConfig.destinationRouter_;
    const link = ccipConfig.linkToken_;

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