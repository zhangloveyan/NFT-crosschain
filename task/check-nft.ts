import { task } from "hardhat/config";
import { ConfigurableTaskDefinition, HardhatRuntimeEnvironment } from "hardhat/types";
import { MyToken } from "../typechain-types";

const taskCheck: ConfigurableTaskDefinition = task("check-nft")
    .setDescription("查询所有的 nft")
    .setAction(async (_, hre: HardhatRuntimeEnvironment) => {
        // 不能显示导入 初始化的时候可能没加载好 通过参数导入 springboot 的对象构建完成
        const { ethers, getNamedAccounts } = hre;

        const { firstAccount } = await getNamedAccounts();
        const nft: MyToken = await ethers.getContract("MyToken", firstAccount);

        const totalSupply = await nft.totalSupply();

        console.log("checking status of MyToken start");
        for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
            const owner = await nft.ownerOf(tokenId);
            console.log(`TokenId: ${tokenId} - owner: ${owner}`);
        }
        console.log("checking status of MyToken end");
    })

export { taskCheck };

