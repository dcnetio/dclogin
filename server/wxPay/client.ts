import type { P2pClient } from "../libp2pclient";
import { pb } from "../../proto/pay_server_proto";
import { Errors } from "./error";
import { CreateOrderRequest, GetPackagesReq, PackageInfo } from "./interface";

export class WxPayClient {
  p2pClient: P2pClient;

  constructor(p2pClient: P2pClient) {
    this.p2pClient = p2pClient;
  }
  async getPackages(
    params: GetPackagesReq
  ): Promise<[PackageInfo[] | null, Error | null]> {
    try {
      if (this.p2pClient == null) {
        throw Errors.ErrP2pClientIsNull;
      }

      const getRequest = new pb.GetPackagesRequest();
      getRequest.lang = params.lang;
      getRequest.currency = params.currency;
      getRequest.pkgType = params.pkgType;

      const messageBytes = pb.GetPackagesRequest.encode(getRequest).finish();
      // 发送请求
      const grpcClient = this.p2pClient.getGrpcClient();
      const responseData = await grpcClient.unaryCall(
        "/pb.PayService/GetPackages",
        messageBytes,
        30000
      );
      const decoded = pb.GetPackagesResponse.decode(responseData);
      if (!decoded) {
        throw Errors.ErrGetPackages;
      }
      if (decoded.code !== 0) {
        throw decoded.msg ? new Error(decoded.msg) : Errors.ErrGetPackages;
      }

      return [decoded.data as PackageInfo[], null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async createOrder(
    params: CreateOrderRequest
  ): Promise<[string | null, Error | null]> {
    try {
      if (this.p2pClient == null) {
        throw Errors.ErrP2pClientIsNull;
      }
      const createOrderRequest = new pb.CreateOrderRequest();
      createOrderRequest.account = params.account || "";
      createOrderRequest.pkgId = params.pkgId || 0;
      createOrderRequest.description = params.description || "";
      if (params.amount) {
        const amountInfo = new pb.AmountInfo();
        amountInfo.total = params.amount.total;
        createOrderRequest.amount = amountInfo;
      }
      createOrderRequest.dappid = params.dappid || "";
      createOrderRequest.timeExpire = params.timeExpire || "";
      createOrderRequest.attach = params.attach || "";

      const messageBytes =
        pb.CreateOrderRequest.encode(createOrderRequest).finish();
      // 发送请求
      const grpcClient = this.p2pClient.getGrpcClient();
      const responseData = await grpcClient.unaryCall(
        "/pb.PayService/CreateOrder",
        messageBytes,
        30000
      );
      const decoded = pb.CreateOrderResponse.decode(responseData);
      if (!decoded) {
        throw Errors.ErrCreateOrder;
      }
      if (decoded.code !== 0) {
        throw decoded.msg ? new Error(decoded.msg) : Errors.ErrCreateOrder;
      }
      const outTradeNo = decoded.data.outTradeNo;
      return [outTradeNo, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async getNativePrepay(
    outTradeNo: string
  ): Promise<[string | null, Error | null]> {
    try {
      if (this.p2pClient == null) {
        throw Errors.ErrP2pClientIsNull;
      }
      const getPrepayRequest = new pb.GetNativePrepayRequest();
      getPrepayRequest.outTradeNo = outTradeNo;

      const messageBytes =
        pb.GetNativePrepayRequest.encode(getPrepayRequest).finish();
      // 发送请求
      const grpcClient = this.p2pClient.getGrpcClient();
      const responseData = await grpcClient.unaryCall(
        "/pb.PayService/GetNativePrepay",
        messageBytes,
        30000
      );
      const decoded = pb.GetNativePrepayResponse.decode(responseData);
      if (!decoded) {
        throw Errors.ErrGetNativePrepay;
      }
      if (decoded.code !== 0) {
        throw decoded.msg ? new Error(decoded.msg) : Errors.ErrGetNativePrepay;
      }
      const codeUrl = decoded.data.codeUrl;
      return [codeUrl, null];
    } catch (error) {
      return [null, error as Error];
    }
  }

  async getStoragePurchaseStatus(
    outTradeNo: string
  ): Promise<[number | null, Error | null]> {
    try {
      if (this.p2pClient == null) {
        throw Errors.ErrP2pClientIsNull;
      }
      const getStatusRequest = new pb.GetStoragePurchaseStatusRequest();
      getStatusRequest.outTradeNo = outTradeNo;

      const messageBytes =
        pb.GetStoragePurchaseStatusRequest.encode(getStatusRequest).finish();
      // 发送请求
      const grpcClient = this.p2pClient.getGrpcClient();
      const responseData = await grpcClient.unaryCall(
        "/pb.PayService/GetStoragePurchaseStatus",
        messageBytes,
        30000
      );
      const decoded = pb.GetStoragePurchaseStatusResponse.decode(responseData);
      if (!decoded) {
        throw Errors.ErrGetPurchaseStatus;
      }
      if (decoded.code !== 0) {
        throw decoded.msg
          ? new Error(decoded.msg)
          : Errors.ErrGetPurchaseStatus;
      }
      const status = decoded.data.status;
      return [status, null];
    } catch (error) {
      return [null, error as Error];
    }
  }
}
