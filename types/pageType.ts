export interface ActivityItem {
  hash: string;
  status: number;
  chainId: string;
  blockNumber: number;
  value: number;
  timestamp: number;
  to: string;
  from: string;
}

export interface OpenInfo {
  appName?: string;
  appIcon?: string;
  appUrl?: string;
  appVersion?: string;
}

export declare const LocalesInfo: {
  transfer: {
    transfer: string;
    amount: string;
    currency: string;
    to: string;
    balance: string;
  };
};
