import { multiaddr } from "@multiformats/multiaddr";
import type { Multiaddr } from "@multiformats/multiaddr";
import { keys } from "@libp2p/crypto";
import { webSockets } from "@libp2p/websockets";
import { createLibp2p, type Libp2p } from "libp2p";
import { identify } from "@libp2p/identify";
import { yamux } from "@chainsafe/libp2p-yamux";
import { noise } from "@chainsafe/libp2p-noise";
import type { Ed25519PrivateKey } from "@libp2p/interface";
import { ping } from "@libp2p/ping";
import { Libp2pGrpcClient } from "grpc-libp2p-client";
import { Protocol } from "../proto/protocol";
// import { eventBus, TOKEN_INVALID_EVENT } from "./event-bus";
// import { getTokenRemainingTime, isTokenExpired } from "./jwt";

// 拨号超时：2s 在部分网络环境下偏紧，适当放宽以提高连接稳定性
export const dial_timeout = 8000;

// HTTP2协议类型定义
export class Http2Type {
  static readonly Handshake = 0x00;
  static readonly Data = 0x01;
  static readonly ACK = 0x02;
  static readonly Close = 0x03;
}

// 浏览器类型定义
export class BrowserType {
  static readonly File = 1;
  static readonly ThreadDB = 2;
}

// 连接状态类型和常量
export type ConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export const ConnectionStatus = {
  DISCONNECTED: "disconnected" as ConnectionStatus,
  CONNECTING: "connecting" as ConnectionStatus,
  CONNECTED: "connected" as ConnectionStatus,
  ERROR: "error" as ConnectionStatus,
};

// 连接结果接口
interface ConnectionResult {
  success: boolean;
  nodeAddr?: Multiaddr;
  error?: string;
  peerId?: string;
}

// 内存密钥存储类
class MemoryKeyStore {
  private static keys: Map<string, Ed25519PrivateKey> = new Map();

  static async loadKeyPair(keyName: string): Promise<Ed25519PrivateKey | null> {
    return this.keys.get(keyName) || null;
  }

  static async saveKeyPair(
    keyName: string,
    keyPair: Ed25519PrivateKey
  ): Promise<void> {
    this.keys.set(keyName, keyPair);
  }

  static clearKeys(): void {
    this.keys.clear();
  }
}

// 工具函数：检查地址是否包含WebSocket协议
function hasWebSocketProtocol(addr: Multiaddr): boolean {
  const addrStr = addr.toString();
  return addrStr.includes("/ws/") || addrStr.includes("/wss/");
}

// 工具函数：从multiaddr中提取peer ID
function extractPeerIdFromMultiaddr(addr: Multiaddr): string | undefined {
  try {
    const addrStr = addr.toString();
    const parts = addrStr.split("/");

    // 查找 p2p 协议后面的值
    const p2pIndex = parts.indexOf("p2p");
    if (p2pIndex !== -1 && p2pIndex + 1 < parts.length) {
      return parts[p2pIndex + 1];
    }

    // 查找 ipfs 协议后面的值（向后兼容）
    const ipfsIndex = parts.indexOf("ipfs");
    if (ipfsIndex !== -1 && ipfsIndex + 1 < parts.length) {
      return parts[ipfsIndex + 1];
    }

    return;
  } catch (error) {
    console.warn("Failed to extract peer ID from multiaddr:", error);
    return;
  }
}

export class P2pClient {
  p2pNode: Libp2p | undefined;
  peerAddr: Multiaddr | undefined;
  private connectionStatus: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private connectionListeners: Set<(status: ConnectionStatus) => void> =
    new Set();

  public token: string = "";

  constructor(peerAddr: string) {
    this.peerAddr = multiaddr(peerAddr);
    // 获取token
    if (localStorage.getItem("session_info")) {
      const info = JSON.parse(localStorage.getItem("session_info") || "{}");
      this.token = info.token || "";
    }
  }

  // 设置认证token
  setAuthToken(token: string): void {
    this.token = token;
    console.log("🔑 P2P客户端token已设置:", token.substring(0, 10) + "...");
  }

  // 获取认证token
  getAuthToken(): string {
    return this.token;
  }

  // 清除认证token
  clearAuthToken(): void {
    this.token = "";
    console.log("🗑️ P2P客户端token已清除");
  }

  // 添加连接状态监听器
  addConnectionListener(listener: (status: ConnectionStatus) => void): void {
    this.connectionListeners.add(listener);
  }

  // 移除连接状态监听器
  removeConnectionListener(listener: (status: ConnectionStatus) => void): void {
    this.connectionListeners.delete(listener);
  }

  // 更新连接状态
  private updateConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatus = status;
    this.connectionListeners.forEach((listener) => listener(status));
  }

  // 获取当前连接状态
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // 初始化P2P客户端
  async initializeP2pNode(): Promise<Libp2p> {
    try {
      this.updateConnectionStatus(ConnectionStatus.CONNECTING);

      if (this.p2pNode) {
        console.log("P2P client already initialized");
        return this.p2pNode;
      }

      this.p2pNode = await this.createP2pNode();

      await this.connectToWebSocketNode(this.peerAddr!.toString());
      this.updateConnectionStatus(ConnectionStatus.CONNECTED);

      console.log("P2P client initialized successfully");
      console.log("Peer ID:", this.p2pNode.peerId.toString());

      return this.p2pNode;
    } catch (error) {
      this.updateConnectionStatus(ConnectionStatus.ERROR);
      console.error("Failed to initialize P2P client:", error);
      throw error;
    }
  }

  // 连接到单个节点
  async connectToPeer(peerAddr: string): Promise<ConnectionResult> {
    try {
      const nodeAddr = await this.connectPeers([peerAddr]);
      if (!nodeAddr) {
        return { success: false, error: "Failed to connect to peer" };
      }

      return {
        success: true,
        nodeAddr,
        peerId: extractPeerIdFromMultiaddr(nodeAddr),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // 连接到多个节点
  private async connectPeers(peerList: string[]): Promise<Multiaddr | null> {
    if (!this.p2pNode) {
      throw new Error("P2P client not initialized");
    }

    return new Promise((resolve) => {
      const len = peerList.length;
      let completedAttempts = 0;
      let resolved = false;

      const dialNodeAddr = async (peerAddr: string) => {
        try {
          const nodeAddr = multiaddr(peerAddr);

          const connection = await this.p2pNode?.dial(nodeAddr, {
            signal: AbortSignal.timeout(dial_timeout),
          });

          if (connection && !resolved) {
            resolved = true;
            resolve(nodeAddr);
          }
        } catch (error) {
          console.warn(`Failed to dial ${peerAddr}:`, error);
        } finally {
          completedAttempts++;
          if (completedAttempts >= len && !resolved) {
            resolve(null);
          }
        }
      };

      // 并行连接所有节点
      peerList.forEach((peerAddr) => dialNodeAddr(peerAddr));
    });
  }

  // 创建P2P节点
  private async createP2pNode(): Promise<Libp2p> {
    console.log("Creating Libp2p node with memory storage...");

    // 创建或加载密钥对（内存存储）
    let keyPair = await MemoryKeyStore.loadKeyPair("ed25519_privateKey");
    if (!keyPair) {
      console.log("Generating new key pair in memory...");
      keyPair = (await keys.generateKeyPair("Ed25519")) as Ed25519PrivateKey;
      await MemoryKeyStore.saveKeyPair("ed25519_privateKey", keyPair);
      console.log("New key pair generated and stored in memory");
    } else {
      console.log("Loaded existing key pair from memory");
    }

    // 创建libp2p实例（简化配置）
    const libp2p = await createLibp2p({
      privateKey: keyPair,
      transports: [
        webSockets({
          filter: (multiaddrs) => {
            return multiaddrs.filter((ma) => hasWebSocketProtocol(ma));
          },
        }),
      ],
      connectionEncrypters: [noise()],
      services: {
        identify: identify(),
        ping: ping(),
      },
      connectionManager: {
        maxParallelDials: 30,
        maxConnections: 30,
        inboundConnectionThreshold: 30,
      },

      streamMuxers: [
        yamux({
          maxStreamWindowSize: 256 * 1024, // 流窗口大小
          maxMessageSize: 16 * 1024, // 消息分片阈值
          keepAliveInterval: 15_000, // 保活检测间隔 (ms)
          maxInboundStreams: 30,
          maxOutboundStreams: 50,
          initialStreamWindowSize: 256 * 1024,
          enableKeepAlive: true,
        }),
      ],
      addresses: {
        listen: [],
      },
    });

    // 添加连接事件监听器
    libp2p.addEventListener("peer:connect", (event) => {
      console.log("Peer connected:", event.detail.toString());
    });

    libp2p.addEventListener("peer:disconnect", (event) => {
      console.log("Peer disconnected:", event.detail.toString());
    });

    console.log("P2p node created successfully with memory storage");
    console.log("Peer ID:", libp2p.peerId.toString());
    console.log(
      "Listening addresses:",
      libp2p.getMultiaddrs().map((addr) => addr.toString())
    );

    return libp2p;
  }

  // 添加WebSocket专用连接方法
  async connectToWebSocketNode(wsAddress: string): Promise<ConnectionResult> {
    try {
      console.log(`🔗 Attempting to connect to WebSocket node: ${wsAddress}`);

      if (!this.p2pNode) {
        throw new Error(
          "P2P client not initialized. Call initializeClient() first."
        );
      }

      // 验证WebSocket地址格式
      const nodeAddr = multiaddr(wsAddress);
      if (!hasWebSocketProtocol(nodeAddr)) {
        return {
          success: false,
          error:
            "Invalid WebSocket address. Must include /ws/ or /wss/ protocol",
        };
      }

      // 尝试连接
      const connection = await this.p2pNode.dial(nodeAddr, {
        signal: AbortSignal.timeout(dial_timeout),
      });

      if (connection) {
        console.log(
          `✅ Successfully connected to WebSocket node: ${wsAddress}`
        );
        return {
          success: true,
          nodeAddr,
          peerId: extractPeerIdFromMultiaddr(nodeAddr),
        };
      } else {
        return {
          success: false,
          error:
            "Connection established but no valid connection object returned",
        };
      }
    } catch (error) {
      console.error(`❌ WebSocket connection failed:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  // 检查地址是否为有效的WebSocket地址
  isValidWebSocketAddress(address: string): boolean {
    try {
      const multiAddr = multiaddr(address);
      return hasWebSocketProtocol(multiAddr);
    } catch {
      return false;
    }
  }

  // 获取支持的传输协议列表
  getSupportedTransports(): string[] {
    return ["WebSockets (ws/wss)"];
  }

  // 清理资源
  async cleanup(): Promise<void> {
    try {
      if (this.p2pNode) {
        await this.p2pNode.stop();
        this.p2pNode = undefined;
      }

      this.updateConnectionStatus(ConnectionStatus.DISCONNECTED);
      this.connectionListeners.clear();

      console.log("P2pNode cleanup completed - all memory storage cleared");
    } catch (error) {
      console.error("Error during cleanup:", error);
    }
  }

  // 获取连接的节点信息
  getConnectedPeers(): string[] {
    if (!this.p2pNode) {
      return [];
    }

    return this.p2pNode.getPeers().map((peerId) => peerId.toString());
  }

  // 获取节点状态信息
  getNodeInfo(): {
    peerId: string | null;
    multiaddrs: string[];
    connections: number;
    status: ConnectionStatus;
    storageType: string;
  } {
    if (!this.p2pNode) {
      return {
        peerId: null,
        multiaddrs: [],
        connections: 0,
        status: this.connectionStatus,
        storageType: "memory",
      };
    }

    return {
      peerId: this.p2pNode.peerId.toString(),
      multiaddrs: this.p2pNode.getMultiaddrs().map((addr) => addr.toString()),
      connections: this.p2pNode.getConnections().length,
      status: this.connectionStatus,
      storageType: "memory",
    };
  }

  // 获取grpcClient
  getGrpcClientWithNoToken(): Libp2pGrpcClient {
    if (this.peerAddr == null) {
      throw new Error("peerAddr is null");
    }
    if (!this.p2pNode) {
      throw new Error("p2pNode is null");
    }

    return new Libp2pGrpcClient(
      this.p2pNode,
      this.peerAddr,
      this.token,
      Protocol
    );
  }
  // 获取grpcClient
  getGrpcClient(): Libp2pGrpcClient {
    if (this.peerAddr == null) {
      throw new Error("peerAddr is null");
    }
    if (!this.p2pNode) {
      throw new Error("p2pNode is null");
    }
    // // 判断token是否为空
    // if (!this.token) {
    //   eventBus.emit(TOKEN_INVALID_EVENT);
    //   const error = new Error("token is null");
    //   error.cause = TOKEN_INVALID_EVENT;
    //   throw error;
    // }

    // // 检查是否过期
    // if (isTokenExpired(this.token)) {
    //   console.log("Token 已过期");
    //   eventBus.emit(TOKEN_INVALID_EVENT);
    //   const error = new Error("token is expired");
    //   error.cause = TOKEN_INVALID_EVENT;
    //   throw error;
    // } else {
    //   const remaining = getTokenRemainingTime(this.token);
    //   if (remaining < 5 * 60) {
    //     // console.log(
    //     //   `Token 有效，还剩 ${remaining} 秒 (${Math.floor(remaining / 60)} 分钟)`
    //     // );
    //     // 剩余时间小于5分钟
    //     eventBus.emit(TOKEN_INVALID_EVENT);
    //     const error = new Error("token is expired");
    //     error.cause = TOKEN_INVALID_EVENT;
    //     throw error;
    //   }
    // }

    return new Libp2pGrpcClient(
      this.p2pNode,
      this.peerAddr,
      this.token,
      Protocol
    );
  }
}
