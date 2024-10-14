const _defaultNetworks = {
  networks: [
    {
      name: "Ethereum Mainnet",
      rpcUrl: "https://mainnet.infura.io/v3/5cc3dc24825a4a06a5f39e21e4cbc03e",
      chainId: 1,
      currencySymbol: "ETH",
      blockExplorerUrl: "https://etherscan.io",
    },
    {
      name: "Binance Smart Chain",
      rpcUrl: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      currencySymbol: "BNB",
      blockExplorerUrl: "https://bscscan.com",
    },
    {
      name: "Polygon (Matic)",
      rpcUrl: "https://rpc-mainnet.maticvigil.com/",
      chainId: 137,
      currencySymbol: "MATIC",
      blockExplorerUrl: "https://polygonscan.com",
    },
    {
      name: "DCCHAIN",
      rpcUrl: "https://chain.baybird.cn",
      chainId: 176,
      currencySymbol: "DCT",
      blockExplorerUrl: "https://dcnetio.baybird.cn",
    },
    {
      name: "Fantom Opera",
      rpcUrl: "https://rpc.ftm.tools/",
      chainId: 250,
      currencySymbol: "FTM",
      blockExplorerUrl: "https://ftmscan.com",
    },
    {
      name: "Avalanche C-Chain",
      rpcUrl: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      currencySymbol: "AVAX",
      blockExplorerUrl: "https://snowtrace.io",
    },
    {
      name: "Arbitrum One",
      rpcUrl: "https://arb1.arbitrum.io/rpc",
      chainId: 42161,
      currencySymbol: "ETH",
      blockExplorerUrl: "https://arbiscan.io",
    },
    {
      name: "Optimism",
      rpcUrl: "https://mainnet.optimism.io",
      chainId: 10,
      currencySymbol: "ETH",
      blockExplorerUrl: "https://optimistic.etherscan.io",
    },
    {
      name: "Harmony Mainnet",
      rpcUrl: "https://api.harmony.one",
      chainId: 1666600000,
      currencySymbol: "ONE",
      blockExplorerUrl: "https://explorer.harmony.one",
    },
  ],
};

const _appState = {
  not_init: 0,
  initing: 1,
  init_success: 2,
  init_failed: 3,
};

export const defaultNetworks = _defaultNetworks;
export const appState = _appState;