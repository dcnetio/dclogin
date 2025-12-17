import type { P2pClient } from "..//libp2pclient";
import { WxPayClient } from "./client";
import { Errors } from "./error";
import { GetPackagesReq, IWxPayManager, PackageInfo } from "./interface";

export class WxPayManager implements IWxPayManager {
  p2pNode: P2pClient;
  constructor(p2pNode: P2pClient) {
    this.p2pNode = p2pNode;
  }
  async getPackages(
    params: GetPackagesReq
  ): Promise<[PackageInfo[] | null, Error | null]> {
    if (this.p2pNode == null) {
      throw Errors.ErrP2pClientIsNull;
    }
    const client = new WxPayClient(this.p2pNode);
    return await client.getPackages(params);
  }
}
