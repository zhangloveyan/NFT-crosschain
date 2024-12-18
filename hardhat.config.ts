import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { HardhatUserConfig } from "hardhat/config";
import "./task";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY as string;
const SPEOLIA_URL = process.env.SPEOLIA_URL as string;
const AMOY_URL = process.env.AMOY_URL as string;

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  namedAccounts: {
    firstAccount: {
      default: 0
    },
    secondAccount: {
      default: 1
    }
  },
  networks: {
    sepolia: {
      url: SPEOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      companionNetworks: {
        destChain: "amoy"
      }
    },
    amoy: {
      url: AMOY_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80002,
      companionNetworks: {
        destChain: "sepolia"
      }
    }
  }
};

export default config;
