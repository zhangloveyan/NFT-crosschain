import { deployments, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";

const deployMyToken: DeployFunction  = async () => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("MyToken 部署合约中。。。")

    await deploy("MyToken", {
        contract: "MyToken",
        from: firstAccount,
        log: true,
        args: ["MyToken", "MT"]
    });

    log("MyToken 部署完成");
}
export default deployMyToken;
deployMyToken.tags = ["sourcechain", "all"]