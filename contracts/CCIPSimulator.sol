// SPDX-License-Identifier: MIT 
// test/demo.t.sol

pragma solidity ^0.8.19;

// import {Test, console2} from "forge-std/Test.sol";
// import {IRouterClient, WETH9, LinkToken, BurnMintERC677Helper} from "@chainlink/local/src/ccip/CCIPLocalSimulator.sol";
import {CCIPLocalSimulator} from "@chainlink/local/src/ccip/CCIPLocalSimulator.sol";

// contract Demo is Test {
//     CCIPLocalSimulator public ccipLocalSimulator;

//     function setUp() public {
//         ccipLocalSimulator = new CCIPLocalSimulator();

//         (
//             uint64 chainSelector,
//             IRouterClient sourceRouter,
//             IRouterClient destinationRouter,
//             WETH9 wrappedNative,
//             LinkToken linkToken,
//             BurnMintERC677Helper ccipBnM,
//             BurnMintERC677Helper ccipLnM
//         ) = ccipLocalSimulator.configuration();

//         ccipLocalSimulator.requestLinkFromFaucet(receiver, amount);
//     }

// }
