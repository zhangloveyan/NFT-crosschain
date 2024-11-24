import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, getNamedAccounts } from "hardhat";
import {} from "@nomicfoundation/hardhat-toolbox";


// 1.测试 用户可以成功 mint nft

// 2.测试 用户可以在原链 lock nft
// 3.测试 用户可以在目标链 mint wnft

// 4.测试 用户可以在目标链 burn wnft
// 5.测试 用户可以在原链 release nft

// 测试前准备
let firstAccount: string;
let secondAccount: string;
let ccip: Contract;
let nft: Contract;
let nftPoolLockAndRelease: Contract;
let wnft: Contract;
let nftPoolBurnAndMint: Contract;
before(async function () {
    const demo = await ethers.getSigners();
    firstAccount = (await getNamedAccounts()).firstAccount;
    // const xx = await getNamedAccounts();
    // firstAccount = xx.firstAccount;
    secondAccount = (await getNamedAccounts()).secondAccount;
    const ccip = await ethers.getContractAt("CCIPLocalSimulator", firstAccount);
    nft = await ethers.getContractAt("MyToken", firstAccount);
    nftPoolLockAndRelease = await ethers.getContractAt("NFTPoolLockAndRelease", firstAccount);
    wnft = await ethers.getContractAt("WrappedMyToken", firstAccount);
    nftPoolBurnAndMint = await ethers.getContractAt("NFTPoolBurnAndMint", firstAccount);
})

describe("原链功能测试", async function () {
    it("用户可以成功 mint nft", async function () {
        await nft.saftMint(firstAccount);
        expect(nft)
    })
})