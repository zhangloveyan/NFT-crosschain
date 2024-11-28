import { task } from "hardhat/config";
import { ConfigurableTaskDefinition, HardhatRuntimeEnvironment } from "hardhat/types";
import { WrappedMyToken } from "../typechain-types";

const taskCheckWnft: ConfigurableTaskDefinition = task("check-wnft")
    .setDescription("查询所有的 wnft")
    .setAction(async (_, hre: HardhatRuntimeEnvironment) => {
        // 不能显示导入 初始化的时候可能没加载好 通过参数导入 springboot 的对象构建完成
        const { ethers, getNamedAccounts } = hre;

        const { firstAccount } = await getNamedAccounts();
        const nft: WrappedMyToken = await ethers.getContract("WrappedMyToken", firstAccount);

        const totalSupply = await nft.totalSupply();

        console.log("checking status of WrappedMyToken start");
        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
            const owner = await nft.ownerOf(tokenId);
            console.log(`TokenId: ${tokenId} - owner: ${owner}`);
        }
        console.log("checking status of WrappedMyToken end");
    })

export { taskCheckWnft };

