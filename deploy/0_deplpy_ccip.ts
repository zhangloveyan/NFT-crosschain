import { deployments, getNamedAccounts } from "hardhat";

module.exports = async () => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("Chainlink-ccip 部署合约中。。。")

    await deploy("CCIPLocalSimulator", {
        contract: "CCIPLocalSimulator",
        from: firstAccount,
        log: true
    });
    
    log("Chainlink-ccip 部署完成");
}

module.exports.tags = ["test", "all"]