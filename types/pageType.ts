import { StoragePurchaseStatus } from "@/config/constant";

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
  _id?: string;
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
export interface OrderRecord {
  _id?: string;
  dappid?: string; // dappid
  orderId: string; // 订单ID
  nftAccount: string; // 购买nft账户
  pkgId: number; // 套餐ID
  pkgName: string; // 套餐名称
  amount: number; // 购买金额
  currency: string; // 货币类型
  status: number; // 订单状态 1.等待确认 2.购买成功
  description?: string; // 订单描述
  createTime: number; // 创建时间戳
  updateTime?: number; // 更新时间戳
}
