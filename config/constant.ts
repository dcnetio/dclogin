const _I18N_LANGUAGES = {
  ZH: "zh",
  EN: "en",
};

const _DEFAULT_NETWORKS = [
  {
    name: "DCCHAIN",
    rpcUrl: "https://dcchain.baybird.cn",
    chainId: 176,
    currencySymbol: "DCT",
    blockExplorerUrl: "https://dcnetio.baybird.cn",
  },
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
];

const _appState = {
  not_init: 0,
  initing: 1,
  init_success: 2,
  init_failed: 3,
};

const _activeStatus = {
  fail: 0, // 0:失败,
  success: 1, // 1:成功,
  pending: 2, // 2:等待确认
};

const _ERROR_CODE = {
  SERVER_SUCCESS: 200,
  SERVER_SUCCESS_DESC: "成功",
  RECEIVE_DOING: 201,
  RECEIVE_DOING_DESC: "赠送存储获取等待中",
  HAS_RECEIVED: 202,
  HAS_RECEIVED_DESC: "赠送存储已经获取过",
  TIMEOUT: 203,
  TIMEOUT_DESC: "处理超时",
  GIVE_OUT_LIMIT: 212,
  GIVE_OUT_LIMIT_DESC: "今日赠送存储不足",
  PARAM_ERROR: 213,
  PARAM_ERROR_DESC: "参数错误",
  VERIFY_APPRECEIPT_ERROR: 214,
  VERIFY_APPRECEIPT_ERROR_DESC: "验证支付凭证失败",
  DECODE_NOTIFICATION_ERROR: 215,
  DECODE_NOTIFICATION_ERROR_DESC: "解析通知消息失败",
};

export const DEFAULT_NETWORKS = _DEFAULT_NETWORKS;
export const appState = _appState;
export const activeStatus = _activeStatus;
export const I18N_LANGUAGES = _I18N_LANGUAGES;
export const NETWORK_CONFIRMS = 6;
export const TRANSACTION_TIMEOUT = 60000;
export const ENCRYPTION_ALGORITHM = "SHA-256";
export const ERROR_CODE = _ERROR_CODE;

export enum EncodePasswordType {
  SET = 1,
  VERIFY = 2,
}

export const NetworkStauts = Object.freeze({
  connecting: 0,
  connected: 1,
  disconnect: 2,
});

export enum MsgStatus {
  success = 0,
  failed = 1,
}

// 货币代码 人民币CNY，美元USD
export enum CurrencyType {
  USD = "USD",
  CNY = "CNY",
}

// 套餐类型 1.nowcode会员费 2.app发布时的应用购买 3.存储购买
export enum PackageType {
  NOWCODE_MEMBER = 1,
  APP_PUBLISH = 2,
  STORAGE_PURCHASE = 3,
}

//套餐名称语言 如: zh, en
export enum PackageLang {
  zh = "zh",
  en = "en",
}

// 存储购买状态 1.待支付 2.购买成功 3.购买取消
export enum StoragePurchaseStatus {
  WAITING_CONFIRM = 1,
  WAITING_CONFIRM_DESC = "待支付",
  SUCCESS = 2,
  SUCCESS_DESC = "已完成",
  CANCEL = 3,
  CANCEL_DESC = "已取消",
}
