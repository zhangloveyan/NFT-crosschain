import { deployments, getNamedAccounts } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";

const deployWrappedMyToken: DeployFunction = async () => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("WrappedMyToken 部署合约中。。。")
    // amoy 0xAF0C0fc5b63513BEEABe488CD2D26143b695a899

    await deploy("WrappedMyToken", {
        contract: "WrappedMyToken",
        from: firstAccount,
        log: true,
        args: ["WrappedMyToken", "WMT"]
    });

    log("WrappedMyToken 部署完成");
}
export default deployWrappedMyToken;
deployWrappedMyToken.tags = ["destchain", "all"]