
import { Deployment } from "hardhat-deploy/dist/types";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { networkConfig } from "../helper-hardhat-config";
import { MyToken } from "../typechain-types";
import { NFTPoolLockAndRelease } from './../typechain-types/contracts/NFTPoolLockAndRelease';

export default task("lock-cross").setDescription("原链锁定 nft 发消息")
    // 命令行通过 --参数名称 传入，这里使用小写 取参数要一致
    // addOptionalParam 可选
    .addOptionalParam("chainselector", "chain selector of dest chain")
    .addOptionalParam("receiver", "receiver address on dest chain")
    .addParam("tokenid", "token id to be crossed chain")
    .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
        const { ethers, getNamedAccounts, network } = hre;
        const { firstAccount } = await getNamedAccounts();
        const chainId = network.config.chainId as number;

        // 参数
        const tokenId = taskArgs.tokenid;
        let chainSelector = taskArgs.chainselector;
        let receiver = taskArgs.receiver;
        // 判断是否存在 不存在从配置文件取
        if (!chainSelector) {
            chainSelector = networkConfig[chainId].compainChainSelector;
            console.log("chainselector is not set in command");
        }
        console.log(`chainselector is ${chainSelector}`);

        if (!receiver) {
            // 需要使用 amoy 的 burn mint 合约地址
            // 在 hardhat config 中配置，让 hardhat 去找 amoy 的部署地址
            const burnMintDeployment: Deployment = await hre
                .companionNetworks["destChain"]
                .deployments
                .get("NFTPoolBurnAndMint");
            receiver = burnMintDeployment.address;
            console.log("receiver is not set in command");
        }
        console.log(`receiver is ${receiver}`);

        // 发送需要 fee （link）前提 部署账户需要有 sepolia 的 link
        const linkAddress = networkConfig[chainId].linkToken;
        const linkContract = await ethers.getContractAt("LinkToken", linkAddress);
        const lockRelease: NFTPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount);
        // 转 fee
        const transTx = await linkContract.transfer(lockRelease.target, ethers.parseEther("1"));
        await transTx.wait(6);
        // 查询余额
        const balance = await linkContract.balanceOf(lockRelease.target);
        console.log(`balance of pool is ${balance}`);


        // 授权 ccip 转移 nft 权限
        const nft: MyToken = await ethers.getContract("MyToken", firstAccount);
        await nft.approve(lockRelease.target, tokenId)
        console.log("approve success");

        // 发送锁定消息
        const lockReleaseTx = await lockRelease.lockAndSendNFT(tokenId, firstAccount, chainSelector, receiver);

        console.log(`ccip tx is sent,tx hash is ${lockReleaseTx.hash}`);
        // 0x0da8ea5d0c5c79093088022cfadc63052865afb7008c66be71dd28906df1b046
        console.log("lock 完成");
    })