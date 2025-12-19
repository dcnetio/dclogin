import { P2pClient } from "./libp2pclient";
import type { IWxPayManager } from "./wxPay/interface";

interface Services {
  p2pClient: P2pClient;
  wxPayManager: IWxPayManager;
}

class DIContainer {
  private services: Partial<Services> = {};

  register<K extends keyof Services>(key: K, service: Services[K]): void {
    this.services[key] = service;
  }

  get<K extends keyof Services>(key: K): Services[K] {
    const service = this.services[key];
    if (!service) {
      throw new Error(`Service ${key} not registered`);
    }
    return service as Services[K];
  }
}

export const container = new DIContainer();
export type { DIContainer };
