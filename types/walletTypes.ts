

export type ChainInfo = {
    chainId: number,
    name: string,
    rpcUrl: string,
    currencySymbol: string,
    blockExplorerUrl?: string,
    desc?: string,
    confirms?: number,
};

export type AccountInfo = {
  url?: string;
  name: string,
  nftAccount: string,
  account: string,
  credentialId: string,
  iv: Uint8Array,
  mnemonic: ArrayBuffer,
  timeStamp: number,
  type: string,
};

export interface TransactionRecord {
  chainId: number;
  hash: string;
  from: string;
  to: string;
  value: string;
  status: number;
  timestamp: number;
}
export enum NetworkStatus {
  Disconnected = 0,
  Connected = 1
}