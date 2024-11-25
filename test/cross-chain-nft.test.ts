import { expect } from 'chai';
import { deployments, ethers, getNamedAccounts } from 'hardhat';
import { CCIPLocalSimulator } from './../typechain-types/@chainlink/local/src/ccip/CCIPLocalSimulator';
import { MyToken, NFTPoolBurnAndMint, NFTPoolLockAndRelease, WrappedMyToken } from './../typechain-types/contracts';

// 1.测试 用户可以成功 mint nft

// 2.测试 用户可以在原链 lock nft
// 3.测试 用户可以在目标链 mint wnft

// 4.测试 用户可以在目标链 burn wnft
// 5.测试 用户可以在原链 release nft

// 测试前准备
let firstAccount: string;
let secondAccount: string;
let ccip: CCIPLocalSimulator;
let nft: MyToken;
let nftPoolLockAndRelease: NFTPoolLockAndRelease;
let wnft: WrappedMyToken;
let nftPoolBurnAndMint: NFTPoolBurnAndMint;

before(async function () {
    // const demo = await ethers.getSigners();
    firstAccount = (await getNamedAccounts()).firstAccount;
    secondAccount = (await getNamedAccounts()).secondAccount;
    await deployments.fixture(["all"]);

    ccip = await ethers.getContract("CCIPLocalSimulator", firstAccount);
    nft = await ethers.getContract("MyToken", firstAccount);
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount);
    wnft = await ethers.getContract("WrappedMyToken", firstAccount);
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount);

    // at 从合约地址 实例化 合约
    // 没有 at 是从 部署地址获取合约
    // const nftDep = await deployments.get("MyToken");
    // nft = await ethers.getContractAt("MyToken", nftDep.address);
})

describe("原链功能测试", async function () {
    it("用户可以成功 mint nft", async function () {
        await nft.safeMint(firstAccount);
        await nft.safeMint(secondAccount);

        const totalSupply = await nft.totalSupply();
        console.log("总 mint 数量", totalSupply);

        const owner_1: string = await nft.ownerOf(0);
        const owner_2: string = await nft.ownerOf(1);
        expect(owner_1).to.equal(firstAccount);
        expect(owner_2).to.equal(secondAccount);
    })

    it("用户可以在原链 lock nft", async function () {

    })
})