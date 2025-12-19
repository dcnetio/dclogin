"use client";
import ethersHelper from "@/helpers/ethersHelper";
import { DEFAULT_NETWORKS, NetworkStauts } from "@/config/constant";
import { ChainInfo } from "@/types/walletTypes";
// 数据库
import DBHelper from "@/helpers/DBHelper";
import { DefChainId } from "@/config/define";

// 定义一个变量，用于存储BroadcastChannel对象
let currentChain: ChainInfo | null = null; //当前网络
let networkStatus: number = NetworkStauts.disconnect; //网络状态

//初始化网络列表,并连接最近切换的网络
async function initNetworks() {
  try {
    const chains = await DBHelper.getAllData(DBHelper.store_chain);
    if (chains.length == 0) {
      for (let i = 0; i < DEFAULT_NETWORKS.length; i++) {
        await DBHelper.addData(DBHelper.store_chain, DEFAULT_NETWORKS[i]);
      }
    }
  } catch (e) {
    console.log("初始化网络列表失败:", e);
  }
  if (currentChain == null) {
    //从数据库中获取第一个网络信息
    const chainInfo = await DBHelper.getData(DBHelper.store_chain, DefChainId);
    if (chainInfo != null) {
      currentChain = chainInfo;
      if (currentChain) {
        //连接网络
        const flag = await ethersHelper.connectWithHttps(currentChain.rpcUrl);
        if (!flag) {
          networkStatus = NetworkStauts.disconnect;
        } else {
          // 设置初始化账户信息+网络信息{key:"connectedChain",value"aaaaa"}
          await DBHelper.addData(DBHelper.store_keyinfo, {
            key: "connectedChain",
            value: currentChain,
          });
          networkStatus = NetworkStauts.connected;
        }
      }
    }
  }
}

// 初始化基本信息(初始化网络为最近切换的网络,账号为最近切换的账号)
async function initBaseinfo() {
  try {
    if (currentChain == null) {
      //从数据库中获取上次打开的网络信息
      const netinfo = await DBHelper.getData(
        DBHelper.store_keyinfo,
        "connectedChain"
      );
      if (netinfo && netinfo.value) {
        currentChain = netinfo.value;
        //连接网络
        const flag = await ethersHelper.connectWithHttps(netinfo.value.rpcUrl);
        if (!flag) {
          networkStatus = NetworkStauts.disconnect;
        } else {
          networkStatus = NetworkStauts.connected;
        }
      }
    }
  } catch (e) {
    console.error("获取网络信息失败:", e);
  }
}

const getCurrentChain = async () => {
  // 取出网络列表
  let chains = [];
  try {
    chains = await DBHelper.getAllData(DBHelper.store_chain);
  } catch (e) {
    console.error("获取网络信息失败:", e);
    return;
  }
  if (currentChain == null) {
    //如果当前网络为空,则取第一个网络
    currentChain = {
      chainId: chains[0].chainId,
      name: chains[0].name,
      rpcUrl: chains[0].rpcUrl,
      desc: chains[0].desc,
      confirms: chains[0].confirms, //确认数
      currencySymbol: chains[0].currencySymbol,
    };
  }
  try {
    // 获取网络信息
    const jsonRpcProvider = ethersHelper.getProvider();
    if (jsonRpcProvider != null) {
      const network = await jsonRpcProvider.getNetwork();
      const chanId = Number(network.chainId);
      if (chanId != currentChain.chainId) {
        const providerChainId = chanId;
        // 将jsonRpcProvider网络切换到当前网络
        for (let i = 0; i < chains.length; i++) {
          if (chains[i].chainId == providerChainId) {
            currentChain = {
              chainId: chains[i].chainId,
              name: chains[i].name,
              rpcUrl: chains[i].rpcUrl,
              desc: chains[i].desc,
              confirms: chains[i].confirms, //确认数
              currencySymbol: chains[i].currencySymbol,
            };
            break;
          }
        }
      }
    }
  } catch (error) {
    console.log("无法连接到网络:", error);
  }
  return currentChain;
};

//添加网络
async function addChain(chainInfo: ChainInfo) {
  if (chainInfo == null) {
    return;
  }
  if (chainInfo.confirms == null || chainInfo.confirms == 0) {
    chainInfo.confirms = 6;
  }
  try {
    await DBHelper.addData(DBHelper.store_chain, chainInfo);
    return true;
  } catch (e) {
    console.error("添加网络失败:", e);
    return false;
  }
}

//修改网络
async function updateChain(chainInfo: ChainInfo) {
  if (chainInfo == null) {
    return;
  }
  if (chainInfo.confirms == null || chainInfo.confirms == 0) {
    chainInfo.confirms = 6;
  }
  try {
    await DBHelper.updateData(DBHelper.store_chain, chainInfo);
    return true;
  } catch (e) {
    console.error("修改网络失败:", e);
    return false;
  }
}

// 切换网络
async function switchChain(chainInfo: ChainInfo) {
  try {
    DBHelper.updateData(DBHelper.store_keyinfo, {
      key: "connectedChain",
      value: chainInfo,
    });
    currentChain = chainInfo;
    //连接网络
    const flag = await ethersHelper.connectWithHttps(currentChain.rpcUrl);
    if (!flag) {
      networkStatus = NetworkStauts.disconnect;
      return;
    } else {
      networkStatus = NetworkStauts.connected;
    }
    return true;
  } catch (e) {
    console.error("切换网络失败:", e);
    return false;
  }
}

const getCurrentNetwork = () => {
  return currentChain;
};
const getNetworkStatus = () => networkStatus;

export {
  getCurrentChain,
  initNetworks,
  initBaseinfo,
  addChain,
  updateChain,
  switchChain,
  getCurrentNetwork,
  getNetworkStatus,
};
