// 错误定义
export class WxPayError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WxPayError";
  }
}
export const Errors = {
  ErrNoPeerConnected: new WxPayError("no peer connected"),
  ErrNodeAddrIsNull: new WxPayError("nodeAddr is null"),
  ErrP2pClientIsNull: new WxPayError("p2pClient is null"),
  ErrGetPackages: new WxPayError("get packages error"),
  ErrCreateOrder: new WxPayError("create order error"),
  ErrGetNativePrepay: new WxPayError("get native prepay id error"),
  ErrGetPurchaseStatus: new WxPayError("get purchase status error"),
};
