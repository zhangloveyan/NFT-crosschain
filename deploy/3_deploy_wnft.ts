import { deployments, getNamedAccounts } from "hardhat";

module.exports = async () => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("WrappedMyToken 部署合约中。。。")

    await deploy("WrappedMyToken", {
        contract: "WrappedMyToken",
        from: firstAccount,
        log: true,
        args: ["WrappedMyToken", "WMT"]
    });

    log("WrappedMyToken 部署完成");
}

module.exports.tags = ["destchain", "all"]