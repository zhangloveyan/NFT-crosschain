import { Deployment } from "hardhat-deploy/dist/types";
import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { networkConfig } from "../helper-hardhat-config";
import { NFTPoolBurnAndMint } from './../typechain-types/contracts/NFTPoolBurnAndMint';
import { WrappedMyToken } from './../typechain-types/contracts/WrappedMyToken';

export default task("burn-cross").setDescription("目标链燃烧 nft 发消息")
    .addOptionalParam("chainselector", "chain selector of source chain")
    .addOptionalParam("receiver", "receiver address on source chain")
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
            const lockRelease: Deployment = await hre
                .companionNetworks["destChain"]
                .deployments
                .get("NFTPoolLockAndRelease");
            receiver = lockRelease.address;
            console.log("receiver is not set in command");
        }
        console.log(`receiver is ${receiver}`);


        // 发送 link  这里手动转账
        const linkAddrss = networkConfig[chainId].linkToken;
        const linkContract = await ethers.getContractAt("LinkToken", linkAddrss);
        const burnMint: NFTPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount);

        // 查询余额 如果够了 就不转了

        let balance = await linkContract.balanceOf(burnMint.target);
        let value = Number(ethers.formatEther(balance));

        console.log(`balance of pool is ${value}`);

        // amoy 很烂 容易超时 多试几次
        if (value < 1) {
            console.log("合约余额不足, 需要转账");
            const transTx = await linkContract.transfer(burnMint.target, ethers.parseEther("1"));
            await transTx.wait(6);

            balance = await linkContract.balanceOf(burnMint.target);
            value = Number(ethers.formatEther(balance));

            console.log(`转账后的合约余额 ${value}`);
        }

        const wnft: WrappedMyToken = await ethers.getContract("WrappedMyToken", firstAccount);
        const approveAddress = await wnft.getApproved(tokenId);
        if (approveAddress !== burnMint.target) {
            // 没有授权
            console.log(`tokenid = ${tokenId} 没有授权给 address = ${burnMint.target}`);
            await wnft.approve(burnMint.target, tokenId);
        } else {
            console.log(`tokenid = ${tokenId} 已授权给 address = ${firstAccount}`);
        }
        console.log("approve success");

        // 销毁 发送解锁信息
        const burnMintTx = await burnMint.burnAndSendNFT(tokenId, firstAccount, chainSelector, receiver);

        console.log(`ccip tx is sent,tx hash is ${burnMintTx.hash}`);
        // 0x39225bff1690651182f92aa7729bf4b6f9111e646ce08cb63b6013ce38113417
        console.log("burn 完成");

    })