import { deployments, getNamedAccounts } from "hardhat";

module.exports = async () => {
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

module.exports.tags = ["sourcechain", "all"]