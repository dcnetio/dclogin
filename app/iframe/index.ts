"use client";
// 定义一个变量，用于存储BroadcastChannel对象
import utilHelper from "@/helpers/utilHelper";
import ethersHelper from "@/helpers/ethersHelper";
let dcWalletChannel: MessagePort | null = null;
let DAPPChannel: MessagePort | null = null;
let walletLoadedFlag = false; //钱包已加载标志
import {Ed25519PrivKey} from './ed25519';
import type { APPInfo, EIP712SignReqMessage, SignReqMessage, SignReqMessageData, SignResponseMessage } from "web-dc-api";
import type { ResponseMessage } from "web-dc-api";
import { AccountInfo, Ed25519PubKey } from "web-dc-api";
// Dapp信息
const appInfo: APPInfo = {
  appId: "",
  appName: "",
  appIcon: "",
  appUrl: "",
  appVersion: "",
};

console.log("**************iframejs");
/*******************************初始化需要完成操作***********************************/
let queryString = "";
if (typeof window !== "undefined") {
  queryString = window.location.search;
}
// 使用 URLSearchParams 解析查询字符串
const urlParams = new URLSearchParams(queryString);
const location = urlParams.get("parentOrigin");
// 获取特定参数的值
const parentOrigin = location;

// 私钥
let privateKey: Ed25519PrivKey | null = null;

/*******************************接收父窗口指令消息***********************************/

// 监听父窗口发送的消息
if (typeof window !== "undefined") {
  window.addEventListener("message", function (event) {
    console.log("========onParentMessage event", event);
    //判断消息来源
    if (
      !(
        event.origin === parentOrigin ||
        (event.origin === "null" && parentOrigin === "file://")
      ) ||
      event.ports.length == 0
    ) {
      return;
    }
    // 对消息进行json解析
    let message = { type: "", data: null };
    if (typeof event.data === "object") {
      try {
        message = event.data;
        console.log("========onParentMessage message", message);
        if (!message.type) {
          //type为空,不处理
          console.error("Received invalid type: no type");
          return;
        }
      } catch (e) {
        console.error("Received invalid message:", event.data, e);
        return;
      }
    }
    if (message.type == "channelPort1") {
      //接收父窗口创建与钱包通信的通信通道
      dcWalletChannel = event.ports[0];
      dcWalletChannel.onmessage = onWalletChannelMessage;
      dcWalletChannel.postMessage({ type: "loaded" });
      return;
    }
    DAPPChannel = event.ports[0];
    switch (message.type) {
      case "init": //初始化配置
        initConfig(message.data);
        break;
      case "connect": //连接钱包命令
        connect();
        break;
      case 'sign': //签名
        sign(message.data);
        break;
      case "signMessage": //签名消息
        signMessage(message.data);
        break;
      case "signEIP712Message": //签名EIP712消息
        signEIP712Message(message.data);
        break;
      case "decrypt": //用私钥解密
        decrypt(message);
        break;
      default:
        break;
    }
  });
}

// Dapp初始化配置
function initConfig(config: APPInfo | null) {
  // 初始化配置
  if(!config) {
    initConfigResponse(false, 'The appInfo is null');
    return
  }
  if(!parentOrigin) {
    initConfigResponse(false, 'The parentOrigin is null');
    return
  }
  if (config.appUrl.indexOf(parentOrigin) ===  -1) {
    initConfigResponse(false, "The appUrl is not equal to the parentOrigin");
    return;
  }
  appInfo.appUrl = config.appUrl;
  appInfo.appId = config.appId;
  appInfo.appName = config.appName;
  appInfo.appIcon = config.appIcon;
  appInfo.appVersion = config.appVersion;
  initConfigResponse(true, "success");
}

// 发送初始化结果消息给父窗口
function initConfigResponse(flag: boolean, message: string) {
  if(!flag) {
    const sendMessage: ResponseMessage<{
      success: boolean,
      message: string,
    }> = {
      type: "initConfigResponse",
      data: {
        success: flag,
        message: message,
      },
    };
    responseToDAPP(sendMessage);
    return;
  }
  // 创建临时私钥公钥
  const seed = crypto.getRandomValues(new Uint8Array(32))  
  privateKey = Ed25519PrivKey.fromSeed(seed)
  const publicKey = privateKey.publicKey?.raw;
  const sendMessage: ResponseMessage<{
    success: boolean,
    message: {
      publicKey: Uint8Array
    }
  }> = {
    type: "initConfigResponse",
    data: {
      success: flag,
      message: {
        publicKey
      },
    },
  };
  responseToDAPP(sendMessage);
}

// 父窗口发送的连接命令处理,打开钱包页面前调用
function connect() {
  // 等待钱包加载完成
  walletLoadedFlag = false;
  waitForFlagToTrue(() => walletLoadedFlag)
    .then((flag) => {
      //钱包已经加载完成
      if (flag) {
        connectWallet();
      }
    })
    .catch((e) => {
      //超时不处理
      console.log(e);
      walletConnected(false, e.message || 'connect error');
      return e;
    });
}

//发送钱包连接成功消息给父窗口
function walletConnected(
  successFlag: boolean,
  responseData: AccountInfo | string
) {
  const sendMessage: ResponseMessage<{
    success: boolean,
    message: AccountInfo | string,
  }> = {
    type: "walletConnected",
    data: {
      success: successFlag,
      message: responseData,
    },
  };
  responseToDAPP(sendMessage);
}

// 父窗口发送的签名处理,打开钱包页面前调用
function sign(data: { message: Uint8Array } | null) {
  if (!data || data.message == null) {
    signResponse(false, "The message is null");
    return;
  }
  //签名
  if(privateKey == null){
    signResponse(false, "The privateKey is null");
    return;
  }
  const signature = privateKey.sign(data.message)
  signResponse(true, signature);
}

//发送签名结果消息给父窗口
function signResponse(successFlag: boolean, message: Uint8Array | string) {
  const sendMessage: ResponseMessage<{
    success: boolean,
    message: Uint8Array | string,
  }> = {
    type: "signResponse",
    data: {
      success: successFlag,
      message: message,
    },
  };
  responseToDAPP(sendMessage);
}

// 父窗口发送的签名消息处理,打开钱包页面前调用
function signMessage(message: SignReqMessage | null) {
  if(message == null) {
    signMessageResponse(false, "The message is null");
    return
  }
  const data = message.data;
  if (data.message == null) {
    signMessageResponse(false, "The message is null");
    return;
  }
  // 等待钱包加载完成
  walletLoadedFlag = false;
  waitForFlagToTrue(() => walletLoadedFlag)
    .then((flag) => {
      //钱包已经加载完成
      if (flag) {
        //发送签名请求消息
        requsetForSignMessage(message);
      }
    })
    .catch((e: any) => {
      //超时不处理
      signMessageResponse(false, e.message || 'signMessage error');
    });
}

//发送签名成功消息给父窗口
function signMessageResponse(successFlag: boolean, message: SignResponseMessage | string) {
  const sendMessage = {
    type: "signMessageResponse",
    data: {
      success: successFlag,
      message: message,
    },
  };
  responseToDAPP(sendMessage);
}

// 父窗口发送的签名EIP712消息处理,打开钱包页面前调用
/** message格式为
{
    type: 'string',//string,hex,base64,eip712
    message: 'test message',
}
**/
function signEIP712Message(message: EIP712SignReqMessage | null) {
  if(message == null) {
    signEIP712MessageResponse(false, "The message is null");
    return;
  }
  const data = message.data;
  //校验数据
  if (data.message == null) {
    signEIP712MessageResponse(false, "The  message is null");
    return;
  }
  if (data.domain == null) {
    signEIP712MessageResponse(false, "The domain is null");
    return;
  }
  if (data.primaryType == null) {
    signEIP712MessageResponse(false, "The primaryType is null");
    return;
  }

  // 等待钱包加载完成
  walletLoadedFlag = false;
  waitForFlagToTrue(() => walletLoadedFlag)
    .then((flag) => {
      //钱包已经加载完成
      if (flag) {
        //发送签名请求消息
        requestSignEIP712Message(message);
      }
    })
    .catch((e: any) => {
      //超时不处理
      signEIP712MessageResponse(false, e.message || 'signEIP712Message error');
    });
}

//发送签名EIP712成功消息给父窗口
function signEIP712MessageResponse(successFlag: boolean, message: SignResponseMessage | string) {
  const sendMessage = {
    type: "signEIP712MessageResponse",
    data: {
      success: successFlag,
      message: message,
    },
  };
  responseToDAPP(sendMessage);
}




async function decrypt(message: any)  {
  const data = message.data;
  if (data.message == null) {
    decryptResponse(false, "The message is null");
    return;
  }
  //签名
  if(privateKey == null){
    decryptResponse(false, "The privateKey is null");
    return;
  }
  const signature = await privateKey.decrypt(data.message)
  decryptResponse(true, signature);
  
}

//发送解密结果消息给父窗口
function decryptResponse(successFlag: boolean, message: any) {
  const sendMessage = {
    type: "decryptResponse",
    data: {
      success: successFlag,
      message: message,
    },
  };
  responseToDAPP(sendMessage);
}



// 发送反馈结果消息给父窗口的DAPP
function responseToDAPP(message: ResponseMessage<any>) {
  if (DAPPChannel != null) {
    const needCloseChannel = DAPPChannel;
    DAPPChannel = null;
    needCloseChannel.postMessage(message);
    // 1秒后关闭通道
    setTimeout(() => {
      needCloseChannel.close();
    }, 1000);
    return;
  }
}

/*********************************与钱包页面通信处理************************************/

// 利用messageChannel通信,发送消息给钱包页面并等待返回
const sendMessageToWallet = async (message: any, timeout: number) => {
  if (!dcWalletChannel) {
    console.error("dcWalletChannel is null");
    return null;
  }
  const messageChannel = new MessageChannel();
  // 等待钱包iframe返回,并关闭channel,超时时间timeout
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject("timeout");
    }, timeout);
    messageChannel.port1.onmessage = (event) => {
      clearTimeout(timer);
      messageChannel.port1.close();
      resolve(event);
    };
    try {
      // window.postMessage(message, walletOrigin, [messageChannel.port2])
      dcWalletChannel?.postMessage(message, [messageChannel.port2]);
    } catch (e) {
      clearTimeout(timer);
      messageChannel.port1.close();
      reject(e);
    }
  });
};

// 发送连接命令给钱包页面,并等待返回
function connectWallet() {
  // 像钱包网页发送连接命令
  const message = {
    type: "connect",
    origin: parentOrigin,
    data: {
      appId: appInfo.appId,
      appName: appInfo.appName,
      appIcon: appInfo.appIcon,
      appUrl: parentOrigin,
      appVersion: appInfo.appVersion,
    },
  };
  //创建新的messageChannel
  sendMessageToWallet(message, 600000)// 10分钟
    .then((event: any) => {
      const message = event.data;
      console.log("connectWallet response:", message);
      if(!message.data || !message.data.privateKey){
        walletConnected(false, "privateKey is empty");
        return;
      }
      // 保存私钥
      const priKey = message.data.privateKey;
      privateKey = new Ed25519PrivKey(priKey) 
      const data = message.data;
      connectResponse(data.signature, {
        nftAccount: data.nftAccount,
        ethAccount: data.ethAccount,
        appAccount: privateKey.publicKey?.raw,
        chainId: data.chainId,
        chainName: data.chainName,
      });
    })
    .catch((e) => {
      console.log("connectWallet error:", e);
      walletConnected(false,  e.message || 'connectWallet error');
    });
  // dcWalletChannel.postMessage(message);
}

// 钱包页面响应连接消息处理,data格式为 {success: true, account: '', chainId: '', signature: ''}
async function connectResponse(signature: string, message: AccountInfo) {
  try {
    if (parentOrigin == null || parentOrigin == "") {
      walletConnected(false,  "The parentOrigin is null");
      return;
    }
    //签名校验,如果校验失败,则不处理
    const flag = ethersHelper.verifySignature(
      parentOrigin,
      signature,
      message.ethAccount
    );
    if (!flag) {
      console.log("verifySignature failed");
      return;
    }
    walletConnected(true, message);
  } catch (e: any) {
    console.log("connectResponse error:", e);
    walletConnected(false, e.message || 'connectResponse error');
    return;
  }
}

// 发送签名消息给钱包页面,并等待返回
function requsetForSignMessage(orignMessage: SignReqMessage) {
  const data = orignMessage.data;
  // 向钱包网页发送签名消息
  const message = {
    type: "signMessage",
    origin: parentOrigin,
    data: data,
  };
  //创建新的messageChannel
  sendMessageToWallet(message, 60000)
    .then((event: any) => {
      const message = event.data;
      responseForsignMessage(data, message.data);
    })
    .catch((e) => {
      signMessageResponse(false, e.message || 'requsetForSignMessage error');
    });
}

// 钱包页面响应签名消息处理
async function responseForsignMessage(waitData: SignReqMessageData, message: SignResponseMessage) {
  try {
    if (message.success) {
      if (waitData.messageType == "hex") {
        const data = utilHelper.hexToUint8Array(waitData.message);
        const flag = ethersHelper.verifySignature(
          data,
          message.signature,
          waitData.ethAccount
        );
        if (!flag) {
          console.log("verifySignature failed");
          return;
        }
      } else {
        const flag = ethersHelper.verifySignature(
          waitData.message,
          message.signature,
          waitData.ethAccount
        );
        if (!flag) {
          console.log("verifySignature failed");
          return;
        }
      }
    }
    //发送签名成功消息给父窗口
    signMessageResponse(message.success, message);
  } catch (e: any) {
    //发送签名失败消息给父窗口
    signMessageResponse(false, e.message || 'responseForsignMessage error');
  }
}

// 发送签名EIP712消息给钱包页面
function requestSignEIP712Message(orignMessage: EIP712SignReqMessage) {
  const data = orignMessage.data;
  // 向钱包网页发送签名消息
  const message = {
    type: "signEIP712Message",
    origin: parentOrigin,
    data: orignMessage.data,
  };
  //创建新的messageChannel
  sendMessageToWallet(message, 60000)
    .then((event: any) => {
      const message = event.data;
      responseForSignEIP712Message(orignMessage, message.data);
    })
    .catch((e: any) => {
      signEIP712MessageResponse(false, e.message || 'requestSignEIP712Message error');
    });
}

// 钱包页面响应签名EIP712消息处理
async function responseForSignEIP712Message(orignMessage: EIP712SignReqMessage, message: SignResponseMessage) {
  try {
    const waitData = orignMessage.data;
    if (message.success) {
      const flag = ethersHelper.verifyEIP712Signature(
        waitData.primaryType,
        waitData.domain,
        waitData.types,
        waitData.message,
        message.signature,
        waitData.ethAccount,
      );
      if (!flag) {
        console.log("verifyEIP712Signature failed");
        return;
      }
    }
    //发送签名成功消息给父窗口
    signEIP712MessageResponse(message.success, message);
  } catch (e: any) {
    //发送签名失败消息给父窗口
    signEIP712MessageResponse(false, e.message || 'responseForSignEIP712Message error');
  }
}

/*********************************接收钱包页面响应信息处理************************************/

// 钱包页面发送的消息处理,只处理加载成功消息,其他消息通过messageChannel处理
function onWalletChannelMessage(event: MessageEvent) {
  const message = event.data;
  // 对消息进行json解析
  if (!message) {
    return;
  }
  if (message.origin !== parentOrigin) {
    //不是发给当前应用,不处理
    console.error(
      "Received invalid origin:",
      message.origin,
      "expected origin:",
      parentOrigin
    );
    return;
  }
  switch (message.type) {
    case "loaded": //钱包页面加载成功
        walletLoadedFlag = true;
      break;
    default:
      break;
  }
}

/*********************************其他处理************************************/

//等待标志位变化
function waitForFlagToTrue(getWalletLoadedFlag: any) {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      //发送是否加载完成确认请求
      const flag = getWalletLoadedFlag();
      if (flag) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve(flag);
      }
    }, 100); // 每100毫秒检查一次
    const timeout = setTimeout(() => {
      clearInterval(interval);
      reject(new Error("Timeout: Flag did not change within 60 seconds"));
    }, 60000); // 60秒超时
  });
}


