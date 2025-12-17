import type { P2pClient } from "../libp2pclient";
import { pb } from "../../proto/pay_server_proto";
import { Errors } from "./error";
import { GetPackagesReq, PackageInfo } from "./interface";

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

  // async createOrder(
  //   account: string,
  //   pkgId: number,
  //   description: string,
  //   amount: number,
  //   dappid: string
  // ): Promise<[string | null, Error | null]> {
  //   try {
  //     if (this.p2pClient == null) {
  //       throw Errors.ErrP2pClientIsNull;
  //     }
  // }
}
