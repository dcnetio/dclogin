


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

export type ConnectReqMessage = {
    version?: string,
    type?: string,
    origin: string,
    data?: {
        appId: string,
        appName: string,
        appIcon?: string,
        appUrl: string,
        appVersion: string,
        account?: string,
        chainId?: string,
    }
}

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


export type SignReqMessage = {
    version: string,
    type: string,
    origin: string,
    data: {
        appName: string,
        appIcon?: string,
        appUrl: string,
        appVersion: string,
        account: string,
        messageType?: string,
        message: string,
    }
}

// SignReqMessage类型检查,每个字段类型也要检查
export function isSignReqMessage(obj: any): obj is SignReqMessage {  
    return (  
      typeof obj === "object" &&  
      obj !== null &&  
      typeof obj.version === "string" &&  
      typeof obj.type === "string" &&  
      typeof obj.origin === "string" &&  
      typeof obj.data === "object" &&  
      obj.data !== null &&  
      typeof obj.data.appName === "string" &&  
      typeof obj.data.appUrl === "string" &&  
      typeof obj.data.appVersion === "string" &&  
      (typeof obj.data.appIcon === "string" || obj.data.appIcon === undefined) &&  
      typeof obj.data.account === "string" &&  
      (typeof obj.data.messageType === "string" || obj.data.messageType === undefined) &&  
      typeof obj.data.message === "string"  
    );  
  }


export  type EIP712SignReqMessage = {
    version: string,
    type: string,
    origin: string,
    data: {
        account: string,
        appName:string,
        appIcon?:string,
        appUrl: string,
        domain: any,
        types: any,
        primaryType: string,
        message: any,
    }
}

// EIP712SignReqMessage类型检查,每个字段类型也要检查
export function isEIP712SignReqMessage(obj: any): obj is EIP712SignReqMessage {  
    return (  
      typeof obj === "object" &&  
      obj !== null &&  
      typeof obj.version === "string" &&  
      typeof obj.type === "string" &&  
      typeof obj.origin === "string" &&  
      typeof obj.data === "object" &&  
      obj.data !== null &&  
      typeof obj.data.account === "string" &&  
      typeof obj.data.appName === "string" &&  
      typeof obj.data.appUrl === "string" &&  
      (typeof obj.data.appIcon === "string" || obj.data.appIcon === undefined) &&  
      typeof obj.data.domain === "object" &&  
      obj.data.domain !== null &&  
      typeof obj.data.types === "object" &&  
      obj.data.types !== null &&  
      typeof obj.data.primaryType === "string" &&  
      typeof obj.data.message === "object" &&  
      obj.data.message !== null  
    );  
  }

export interface User {
  callMinusNumber: number; //调用手续费单位（与用户订阅的空间大小相关，空间越大这个值越小）
  commentFrozenStatus: number; //评论相关功能(包括keyvalue数据库、主题评论等功能)冻结状态
  commentReportAmount: number; //评论举报次数
  commentReportNumber: number; //下一次消除举报次数的区块高度
  dbConfig: string; //用户个体库配置信息，格式（threadid|sk|rk)加密后的值，（用户公钥加密后的字符串值，用户私钥可以解密）
  dbUpdateNumber: number; //用户个体库信息更新区块高度
  encNftAccount: string; //用户绑定的账号加密后字符串（用户公钥加密后的值，用户私钥可以解密）
  expireNumber: number; //订阅过期区块高度
  loginNumber: number; //登录次数
  nftUpdateNumber: number; //用户nft账号更新区块高度
  offchainOptimes: number; //链下允许总调用次数,当前会一直累加
  offchainSpace: number; //链下允许总调用空间，当前会一直累加
  parentAccount: string; //父账号pubkey
  peers: Array<string>; //账号登录信息存储的节点ID列表
  purchaseNumber: number; //购买次数
  requestPeers: Array<string>; //允许上传文件的节点ID列表,如果不在列表中则无法上传文件,需要先发起绑定请求
  spamFrozenStatus: number; //垃圾信息相关功能冻结状态
  spamReportAmount: number; //垃圾信息举报次数
  spamReportNumber: number; //下一次消除垃圾信息举报次数的区块高度
  subscribePrice: string; //订阅价格
  subscribeSpace: number; //订阅空间大小，单位KB
  usedSpace: number; //已使用空间大小，单位KB
}