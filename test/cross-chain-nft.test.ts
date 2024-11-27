import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { CCIPLocalSimulator } from "./../typechain-types/@chainlink/local/src/ccip/CCIPLocalSimulator";
import { MyToken, NFTPoolBurnAndMint, NFTPoolLockAndRelease, WrappedMyToken } from "./../typechain-types/contracts";

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
let chainSelector: bigint;

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

    const config = await ccip.configuration();
    chainSelector = config.chainSelector_;
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
        console.log("nft 总 mint 数量", totalSupply.toString());

        const owner_1: string = await nft.ownerOf(0);
        const owner_2: string = await nft.ownerOf(1);
        expect(owner_1).to.equal(firstAccount);
        expect(owner_2).to.eq(secondAccount);
    })

    it("用户可以在原链 lock nft", async function () {
        // 允许 合约转移 token
        await nft.approve(nftPoolLockAndRelease.target, 0);
        // 通过 ccip 给 nft lock 合约地址领水    
        await ccip.requestLinkFromFaucet(
            nftPoolLockAndRelease,
            ethers.parseEther("10"));
        // nft 锁定 并 发送消息 铸造新链
        await nftPoolLockAndRelease.lockAndSendNFT(
            0,
            firstAccount,
            chainSelector,
            nftPoolBurnAndMint.target)

        const owner = await nft.ownerOf(0);
        expect(owner).equal(nftPoolLockAndRelease.target);
    })

    it("用户可以在目标链 mint wnft", async function () {
        const totalSupply = await wnft.totalSupply();
        console.log("wnft 总 mint 数量", totalSupply.toString());

        const owner_1: string = await wnft.ownerOf(0);
        expect(owner_1).to.equal(firstAccount);
    })

    it("测试 用户可以在目标链 burn wnft", async function () {
        // 允许 合约转移 token
        await wnft.approve(nftPoolBurnAndMint.target, 0);
        await ccip.requestLinkFromFaucet(
            nftPoolBurnAndMint,
            ethers.parseEther("10"));
        // nft 烧掉 并 发送消息 解锁原链
        await nftPoolBurnAndMint.burnAndSendNFT(
            0,
            firstAccount,
            chainSelector,
            nftPoolLockAndRelease.target
        )
        const totalSupply = await wnft.totalSupply();
        console.log("wnft 剩余数量", totalSupply.toString());
        expect(0).eq(totalSupply);
    })

    it("用户可以在原链 release nft", async function () {

        const owner = await nft.ownerOf(0);
        expect(owner).equal(firstAccount);
    })
})