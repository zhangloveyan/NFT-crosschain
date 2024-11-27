import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { MyToken } from '../typechain-types';

export default task("mint-nft")
    .setDescription("铸造原链的 nft")
    .setAction(async (_, hre: HardhatRuntimeEnvironment) => {
        const { getNamedAccounts, ethers } = hre;
        const { firstAccount } = await getNamedAccounts();
        const nft: MyToken = await ethers.getContract("MyToken", firstAccount);

        console.log("minting a nft from contract start");
        const mintTx = await nft.safeMint(firstAccount);
        mintTx.wait(6);
        console.log("nft minted");
    })