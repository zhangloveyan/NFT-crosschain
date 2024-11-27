import { deployments, getNamedAccounts, network } from "hardhat";
import { developementChains } from "../helper-hardhat-config";
import { DeployFunction } from "hardhat-deploy/dist/types";

const deployCCIP: DeployFunction = async () => {
    if (developementChains.includes(network.name)) {

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
}
export default deployCCIP;

deployCCIP.tags = ["test", "all"]