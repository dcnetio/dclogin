export interface GetPackagesReq {
  pkgType: number; // 套餐类型 1.nowcode会员费 2.app发布时的应用购买 3.存储购买
  lang: string; // 套餐名称语言 如: zh, en
  currency: string; // 货币代码 人民币CNY，美元USD
}

/** Properties of a PackageInfo. */
export interface PackageInfo {
  /** PackageInfo pkgId */
  pkgId?: number | null;

  /** PackageInfo pkgType */
  pkgType?: number | null;

  /** PackageInfo pkgName */
  pkgName?: string | null;

  /** PackageInfo lang */
  lang?: string | null;

  /** PackageInfo amount */
  amount?: number | null;

  /** PackageInfo currency */
  currency?: string | null;

  /** PackageInfo validDays */
  validDays?: number | null;

  /** PackageInfo callTimes */
  callTimes?: number | null;

  /** PackageInfo chainPkgId */
  chainPkgId?: number | null;

  /** PackageInfo spaceSize */
  spaceSize?: number | null;

  /** PackageInfo createTime */
  createTime?: string | null;
}

interface AmountInfo {
  /** AmountInfo total */
  total?: number | null;
}

export interface CreateOrderRequest {
  /** CreateOrderRequest account */
  account?: string | null;

  /** CreateOrderRequest pkgId */
  pkgId?: number | null;

  /** CreateOrderRequest description */
  description?: string | null;

  /** CreateOrderRequest amount */
  amount?: AmountInfo | null;

  /** CreateOrderRequest dappid */
  dappid?: string | null;
}
export interface IWxPayManager {
  getPackages(
    params: GetPackagesReq
  ): Promise<[PackageInfo[] | null, Error | null]>;

  createOrder(
    params: CreateOrderRequest
  ): Promise<[string | null, Error | null]>;

  getNativePrepay(outTradeNo: string): Promise<[string | null, Error | null]>;

  getStoragePurchaseStatus(
    outTradeNo: string
  ): Promise<[number | null, Error | null]>;
}
