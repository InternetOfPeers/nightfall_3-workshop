require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");

module.exports = {
  solidity: {
    version: "0.8.17",
    settings: {
      evmVersion: "london",
      optimizer: {
        enabled: true,
        runs: 1,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  defaultNetwork: "hedera",
  networks: {
    hedera: {
      url: process.env.ETH_RPC_URL || "http://localhost:7546",
      accounts: [process.env.EVM_PRIVATE_KEY],
      timeout: 9999999,
      chainId: 296,
    },
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://server-verify.hashscan.io",
    browserUrl: "https://repository-verify.hashscan.io",
  },
  etherscan: {
    enabled: false,
  },
};