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

export declare const LocalesInfo: {
  transfer: {
    transfer: string;
    amount: string;
    currency: string;
    to: string;
    balance: string;
  };
};

export interface AuthRecord {
  recordId?: string;
  appId: string;
  appName: string;
  appIcon: string;
  appUrl: string;
  nftAccount: string;
  account: string;
  timestamp: number;
}
export interface EncodePasswordInfo {
  nftAccount: string;
  iv: Uint8Array;
  encodeMnimonic: ArrayBuffer;
  credentialId?: string;
}
