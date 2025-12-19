import { peerUrl } from "../config/define";
import { P2pClient } from "./libp2pclient";
import type { DIContainer } from "./dc-contianer";
import { WxPayManager } from "./wxPay/manager";
// 初始化容器
export const initializeServices = async (
  container: DIContainer
): Promise<boolean> => {
  try {
    console.log("🚀 开始初始化服务...");
    console.log("🔗 对等节点地址:", peerUrl);

    // 创建并初始化 P2P 客户端
    const p2pClient = new P2pClient(peerUrl);
    console.log("🔧 创建 P2P 客户端完成");

    await p2pClient.initializeP2pNode();
    console.log("✅ P2P 节点初始化完成");

    // 注册 P2P 客户端
    container.register("p2pClient", p2pClient);
    console.log("📝 注册 p2pClient 完成");

    // 注册各种服务管理器
    container.register("wxPayManager", new WxPayManager(p2pClient));
    console.log("📝 注册 wxPayManager 完成");

    console.log("🎉 所有服务初始化完成！");
    return true;
  } catch (error) {
    console.error("❌ 服务初始化失败:", error);
    if (error instanceof Error) {
      console.error("错误详情:", error.message);
      console.error("错误堆栈:", error.stack);
    }
    return false;
  }
};
