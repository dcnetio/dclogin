import { Ed25519PubKey } from "web-dc-api";



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

