export type ChainInfo = {
  chainId: number;
  name: string;
  rpcUrl: string;
  currencySymbol: string;
  blockExplorerUrl?: string;
  desc?: string;
  confirms?: number;
};

export type AccountInfo = {
  url?: string;
  name?: string;
  nftAccount: string;
  account: string;
  credentialId: string;
  iv?: Uint8Array;
  mnemonic?: ArrayBuffer;
  timeStamp: number;
  type: string;
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
  Connected = 1,
}

export type ConnectReqMessage = {
  type?: string;
  origin: string;
  data?: {
    appId: string;
    appName: string;
    appIcon?: string;
    appUrl: string;
    appVersion: string;
    // account?: string,
    // chainId?: string,
    accountInfo?: AccountInfo;
    shouldReturnUserInfo?: boolean;
    attach?: string;
  };
};

// ConnectReqMessage类型检查,每个字段类型也要检查
export function isConnectReqMessage(obj: any): obj is ConnectReqMessage {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.type === "string" &&
    typeof obj.origin === "string" &&
    typeof obj.data === "object" &&
    obj.data !== null &&
    typeof obj.data.appName === "string" &&
    typeof obj.data.appUrl === "string" &&
    typeof obj.data.appVersion === "string" &&
    (typeof obj.data.appIcon === "string" || obj.data.appIcon === undefined) &&
    (typeof obj.data.account === "string" || obj.data.account === undefined) &&
    (typeof obj.data.chainId === "string" || obj.data.chainId === undefined)
  );
}

export type SignReqMessageData = {
  appUrl: string;
  ethAccount: string;
  messageType?: string; // 'string',//string,hex,base64,eip712
  message: string;
};

export type SignReqMessage = {
  type: string;
  origin: string;
  data: SignReqMessageData;
};

// SignReqMessage类型检查,每个字段类型也要检查
export function isSignReqMessage(obj: any): obj is SignReqMessage {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.type === "string" &&
    typeof obj.origin === "string" &&
    typeof obj.data === "object" &&
    obj.data !== null &&
    typeof obj.data.appUrl === "string" &&
    typeof obj.data.ethAccount === "string" &&
    (typeof obj.data.messageType === "string" ||
      obj.data.messageType === undefined) &&
    typeof obj.data.message === "string"
  );
}

export type EIP712SignReqMessage = {
  type: string;
  origin: string;
  data: {
    appUrl: string;
    ethAccount: string;
    domain: any;
    types: any;
    primaryType: string;
    message: any;
  };
};

// EIP712SignReqMessage类型检查,每个字段类型也要检查
export function isEIP712SignReqMessage(obj: any): obj is EIP712SignReqMessage {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.type === "string" &&
    typeof obj.origin === "string" &&
    typeof obj.data === "object" &&
    obj.data !== null &&
    typeof obj.data.ethAccount === "string" &&
    typeof obj.data.domain === "object" &&
    obj.data.domain !== null &&
    typeof obj.data.types === "object" &&
    obj.data.types !== null &&
    typeof obj.data.primaryType === "string" &&
    typeof obj.data.message === "object" &&
    obj.data.message !== null
  );
}

export type SignResponseMessage = {
  success: boolean;
  signature: string;
};

export type ResponseMessage<T> = {
  type: string;
  data: T;
};
