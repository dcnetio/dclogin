"use client";
import utilHelper from "@/helpers/utilHelper";
import ethersHelper from "@/helpers/ethersHelper";
import { MsgStatus } from "@/config/constant";
import { store } from "@/lib/store";
import {
  setShouldReturnUserInfo,
  updateAppInfo,
  updateAuthStep,
} from "@/lib/slices/authSlice";
import { getCurrentChain } from "@/services/network";
import { applyFreeSpace } from "@/app/tools/subSpace";

import type { Ed25519PrivKey } from "web-dc-api";
import { KeyManager } from "web-dc-api";

import { showSignatureDAPPNote } from "@/components/note/noteHelper";
import i18n from "@/locales/i18n";
import {
  bindNFTAccount,
  chooseStoredAccount,
  createAccount,
  generateWalletAccount,
  getToken,
  resPonseWallet,
  setCurrentAccount,
  unlockWallet,
} from "../account";
import { HDNodeWallet } from "ethers/wallet";
import {
  ConnectReqMessage,
  isConnectReqMessage,
  isSignReqMessage,
  EIP712SignReqMessage,
  isEIP712SignReqMessage,
  SignReqMessage,
  AccountInfo,
} from "@/types/walletTypes";
import { checkDCInitialized, getDC } from "@/components/auth/login/dc";
import { initUserDB } from "../threadDB";
import { dcConfig } from "@/config/define";

// 获取查询字符串
let queryString = "";
if (typeof window !== "undefined") {
  queryString = window.location.search;
}
const urlParams = new URLSearchParams(queryString);
const location = urlParams.get("origin");
const openerOrigin = location;
let iframeChannel = null;

let messageData: ConnectReqMessage = { origin: "" };
let portData: MessagePort | null = null;

// 监听DAPP窗口发送的消息;
if (typeof window !== "undefined") {
  try {
    console.log("Initializing DApp message listener");
    if (
      window.location.href.indexOf("/test") == -1 &&
      window.location.href.indexOf("/iframe") == -1
    ) {
      console.log(
        "===============监听DAPP窗口发送的消息 11111",
        window.location.href
      );

      window.addEventListener("message", function (event) {
        //判断消息来源
        if (
          !(
            event.origin === openerOrigin ||
            (event.origin === "null" && openerOrigin === "file://")
          ) ||
          event.ports.length == 0
        ) {
          return;
        }
        onDAPPMessage(event);
      });
    }
  } catch (e) {
    console.error("Failed to initialize DApp listener", e);
  }
}

// 通知DAPP,钱包加载完成
function initCommChannel() {
  //通知DAPP,钱包加载完成
  const message = {
    type: "walletLoaded",
    data: {
      origin: window.location.origin,
    },
  };
  if (window.opener) {
    let origin = openerOrigin;
    if (openerOrigin?.indexOf("file://") !== -1) {
      origin = "*";
    }
    window.opener.postMessage(message, origin);
  } else if (window.parent) {
    let origin = openerOrigin || "";
    if (openerOrigin?.indexOf("file://") !== -1) {
      origin = "*";
    }
    window.parent.postMessage(message, origin);
  }
}

// 来自DAPP的消息处理
async function onDAPPMessage(event: MessageEvent) {
  let message = null;
  // 对消息进行json解析
  message = event.data;
  if (!message) {
    return;
  }
  if (event.ports.length == 0) {
    return;
  }
  if (message.origin != openerOrigin) {
    //判断消息来源
    return;
  }
  //判断消息类型,message格式为{type: 'getUserInfo', data: {}}
  switch (message.type) {
    case "checkWalletLoaded": //检查钱包是否加载完成请求
      const sendMessage = {
        type: "walletLoaded",
        data: {
          origin: window.location.origin,
        },
      };
      event.ports[0].postMessage(sendMessage); //利用messageChannel通知页面加载完成,当浏览器不支持window.opener会走这个流程
      break;
    case "channelPort2":
      iframeChannel = event.ports[0];
      iframeChannel.onmessage = onDAPPMessage;
      const loadedMessage = {
        type: "loaded",
        origin: openerOrigin,
      };
      iframeChannel.postMessage(loadedMessage); //利用messageChannel通知页面加载完成,当浏览器不支持window.opener会走这个流程
      break;
    case "connect": //连接钱包请求
      console.log("connect=====", message);
      console.log("event=====", event);
      if (isConnectReqMessage(message)) {
        const connectingApp = message.data;
        if (openerOrigin && connectingApp) {
          const dc = getDC();
          if (dc) {
            // 保存dappinfo
            const dappInfo = {
              appId: connectingApp?.appId || "",
              appName: connectingApp?.appName || "",
              appIcon: connectingApp?.appIcon || "",
              appUrl: connectingApp?.appUrl || "",
              appVersion: connectingApp?.appVersion || "",
            };
            dc.setAppInfo(dappInfo);
          }

          store.dispatch(
            setShouldReturnUserInfo(connectingApp?.shouldReturnUserInfo)
          );

          //显示提示页面
          store.dispatch(
            updateAppInfo({
              appId: connectingApp?.appId,
              appName: connectingApp?.appName,
              appIcon: connectingApp?.appIcon,
              appUrl: connectingApp?.appUrl,
              appVersion: connectingApp?.appVersion,
            })
          );
          connectCmdHandler(message, true, event.ports[0]);
          return;
        } else {
          connectCmdHandler(message, true, event.ports[0]);
        }
      }
      break;
    case "signMessage": //签名请求
      if (isSignReqMessage(message)) {
        const data = message.data;
        if (openerOrigin && data) {
          //显示提示页面
          showSignatureDAPPNote(data.appUrl, data.message, () => {
            signMessageHandler(message, event.ports[0]);
          });
          return;
        } else {
          signMessageHandler(message, event.ports[0]);
        }
      }
      break;
    case "signEIP712Message": //签名EIP712请求
      if (isEIP712SignReqMessage(message)) {
        const data = message.data;
        if (openerOrigin && data) {
          //显示提示页面
          showSignatureDAPPNote(data.appUrl, data.message, () => {
            signEIP712MessageHandler(message, event.ports[0]);
          });
          return;
        } else {
          signEIP712MessageHandler(message, event.ports[0]);
        }
      }
      break;
    default:
      break;
  }
}

// 已有账号解密调用登录
// 收到连接钱包请求处理,message格式为{type: 'connect',data: {appName:'test',appIcon:'',appUrl: 'http://localhost:8080',appVersion: '1.0.0'}}
async function connectCmdHandler(
  message: ConnectReqMessage,
  bool: boolean,
  port: MessagePort | null = null
): Promise<{
  success: boolean;
  data: AccountInfo | null;
  error?: Error | null;
}> {
  // // 获取当前网络
  // const chain = await getCurrentChain();
  // if (!chain) {
  //   //待测试 跳出提示框,提示用户获取网络信息失败
  //   store.dispatch(
  //     updateAuthStep({
  //       type: MsgStatus.failed,
  //       content: i18n.t("network.get_failed"),
  //       needLogin: false,
  //     })
  //   );
  //   return;
  // }

  messageData = message;
  portData = port;
  let chooseAccount = await chooseStoredAccount();
  console.log("---------chooseAccount", Date.now());
  if (!chooseAccount) {
    // 如果用户没有登录账号，判断是否有账号信息传过来，有的话直接用
    if (
      messageData.data &&
      messageData.data.accountInfo &&
      messageData.data.accountInfo.nftAccount
    ) {
      chooseAccount = messageData.data.accountInfo;
      setCurrentAccount(chooseAccount);
    }
    if (!chooseAccount) {
      // 没有用户的时候，需要跳转到登录页面
      store.dispatch(
        updateAuthStep({
          type: MsgStatus.failed,
          content: i18n.t("auth.no_account"),
          needLogin: true,
        })
      );
      return;
    }
  }
  const mnemonic = await unlockWallet(chooseAccount);
  if (!mnemonic) {
    return;
  }
  const connectingApp = message.data;
  const appInfo = connectingApp || null;
  // 不是来自默认Dapp的
  if (!appInfo || !appInfo.appId) {
    const appId = dcConfig.appInfo?.appId || "";
    const dc = getDC();
    if (dc) {
      const nAppInfo = store.getState().auth.appInfo || null;
      nAppInfo && dc.setAppInfo(nAppInfo);
      const keymanager = new KeyManager();
      const privKey: Ed25519PrivKey =
        await keymanager.getEd25519KeyFromMnemonic(mnemonic, appId || "");
      await dc.auth.generateAppAccount(appId, mnemonic);
      const parentPrivKey: Ed25519PrivKey =
        await keymanager.getEd25519KeyFromMnemonic(mnemonic, "");
      dc.setParentPublicKey(parentPrivKey.publicKey);
      dc.setPublicKey(privKey.publicKey);
      window.showToast({
        content: i18n.t("account.init_user_db_ing"), // "初始化用户数据库中"
        position: "center",
        duration: 0,
      });
      dc.setPrivateKey(privKey);
      // 获取token
      const [res, err] = await getToken(privKey.publicKey.string());
      console.log("=====1====getToken", res, err);
      try {
        // 设置threadDB
        await initUserDB();
      } catch (error) {
        console.error("initUserDB", error);
      }
      window.clearToast();
    }
  }
  return await resPonseWallet(mnemonic, chooseAccount, message, bool, port);
}

/** 收到签名请求处理,message格式为
{
    type: 'signMessage', 
    origin: 'http://localhost:8080',
    data: {
            messageType: 'string',//string,hex
            message: 'test message',
        }
}
**/
async function signMessageHandler(
  message: SignReqMessage,
  port: MessagePort | null = null
) {
  const data = message.data;
  if (data.ethAccount == null) {
    //没有签名账号,不做处理
    return;
  }
  const wallet = await generateWalletAccount(data.ethAccount);
  if (!wallet) {
    return;
  }
  let signature = null;
  if (data.messageType == "hex") {
    const waitSignMessage = utilHelper.hexToUint8Array(data.message);
    // 执行签名
    signature = await ethersHelper.signMessage(wallet, waitSignMessage);
    if (!signature) {
      //待测试 跳出提示框,提示用户签名失败
      window.showToast({
        content: i18n.t("account.auth_failed"),
        position: "center",
      });
      return;
    }
  } else {
    // 执行签名
    signature = await ethersHelper.signMessage(wallet, data.message);
    if (!signature) {
      //待测试 跳出提示框,提示用户签名失败
      window.showToast({
        content: i18n.t("sign.sign_failed"),
        position: "center",
      });
      return;
    }
  }

  //签名成功后,发送签名成功消息给APP,并返回签名结果
  const resMessage = {
    type: "signSuccess",
    origin: message.origin,
    data: {
      success: true,
      signature: signature,
    },
  };
  if (port) {
    port.postMessage(resMessage);
    // 1秒后关闭port
    setTimeout(() => {
      port.close();
    }, 1000);
  }
  // 关闭当前窗口,并返回原来的窗口
  if (window.opener) {
    // 可以在原窗口中执行一些操作，例如导航
    window.opener.focus(); // 返回并聚焦到原窗口
  }
  window.close();
}

//收到签名EIP712请求处理,message格式为
// {
//     code: 'CxzQW5n8k0',
//     type: 'signEIP712Message',
//     data: {
//             domain: {
//                 name: 'Test',
//                 version: '1.0.0',
//                 chainId: 1,
//                 verifyingContract: '0x1234567890123456789012345678901234567890',
//
//             },
//             types: {
//                 Person: [
//                     { name: 'name', type: 'string' },
//                     { name: 'wallet', type: 'address' }
//                 ],
//                 Mail: [
//                     { name: 'from', type: 'Person' },
//                     { name: 'to', type: 'Person' },
//                     { name: 'contents', type: 'string' }
//                 ],
//             },
//             message: {
//                 from: {
//                     name: 'Cow',
//                     wallet: '',
//                 },
//                 to: {
//                     name: 'Bob',
//                     wallet: '0xbBbBBBBbb',
//                 },
//                 contents: 'Hello, Bob!'
//             }
//         }
// }
async function signEIP712MessageHandler(
  message: EIP712SignReqMessage,
  port: MessagePort | null = null
) {
  const data = message.data;
  if (data.ethAccount == null) {
    //没有签名账号,不做处理
    return;
  }
  const wallet = await generateWalletAccount(data.ethAccount);
  if (!wallet) {
    return;
  }
  // 执行签名
  const signature = await ethersHelper.signEIP712Message(
    wallet,
    data.primaryType,
    data.domain,
    data.types,
    data.message
  );
  if (!signature) {
    //待测试 跳出提示框,提示用户签名失败
    window.showToast({
      content: i18n.t("sign.sign_failed"),
      position: "center",
    });
    return;
  }
  //签名成功后,发送签名成功消息给APP,并返回签名结果
  const resMessage = {
    type: "signEIP712Success",
    origin: message.origin,
    data: {
      success: true,
      signature: signature,
    },
  };
  if (port) {
    port.postMessage(resMessage);
    // 1秒后关闭port
    setTimeout(() => {
      port.close();
    }, 1000);
  }
  // 关闭当前窗口,并返回原来的窗口
  if (window.opener) {
    // 可以在原窗口中执行一些操作，例如导航
    window.opener.focus(); // 返回并聚焦到原窗口
  }
  window.close();
}

let walletAccount: HDNodeWallet | null = null;
// 创建账号(注册)
async function createAccountWithRegister(
  account: string,
  password: string,
  safecode: string
) {
  const dc = getDC();
  if (!dc) {
    return;
  }
  const appInfo = store.getState().auth.appInfo || null;
  if (!dc.appInfo || !dc.appInfo.appId || dc.appInfo.appId !== appInfo?.appId) {
    dc.setAppInfo(appInfo);
  }
  // 判断account是否已经存在
  const [nftBinded, error] = await dc.auth.isNftAccountBinded(account);
  if (error || nftBinded) {
    window.showToast({
      content: i18n.t("account.nft_account_binded"),
      position: "center",
    });
    return;
  }
  if (!walletAccount || !walletAccount.mnemonic) {
    walletAccount = await ethersHelper.createWalletAccount();
    if (!walletAccount || !walletAccount.mnemonic) {
      return;
    }
  }
  const mnemonicObj = walletAccount.mnemonic; // 对象
  let mnemonic = mnemonicObj.phrase; // 助记词
  const keymanager = new KeyManager();
  const privKey: Ed25519PrivKey = await keymanager.getEd25519KeyFromMnemonic(
    mnemonic,
    ""
  );
  // 赠送套餐
  window.showToast({
    content: i18n.t("account.give_space_ing"), // 赠送中
    position: "center",
    duration: 0,
  });
  const giveFlag = await applyFreeSpace(privKey.publicKey);
  if (
    giveFlag[1] &&
    giveFlag[1].message &&
    giveFlag[1].message.indexOf(i18n.t("storage.has_space")) === -1
  ) {
    //待测试 跳出提示框,提示用户赠送套餐失败
    window.showToast({
      content: giveFlag[1].message || i18n.t("account.give_space_failed"),
      position: "center",
    });
    return;
  }
  window.showToast({
    content: i18n.t("account.bind_nft_account_ing"), // 绑定中
    position: "center",
    duration: 0,
  });
  // bind nft
  const bindRes = await bindNFTAccount(
    account,
    password,
    safecode,
    mnemonic,
    "0x" + privKey.publicKey.toString()
  );
  if (bindRes[0] !== true) {
    //待测试 跳出提示框,提示用户赠送套餐失败
    const errInfo = bindRes[1];
    const errMsg = errInfo && errInfo.message;
    window.showToast({
      content: errMsg || i18n.t("account.bind_nft_account_failed"),
      position: "center",
    });
    if (
      bindRes[1] &&
      bindRes[1].message &&
      bindRes[1].message.indexOf("user has binded an account") !== -1
    ) {
      walletAccount = null; // 清除钱包账号
    }
    return;
  }
  try {
    const appInfo = store.getState().auth.appInfo || null;
    const appId = appInfo?.appId;
    await dc.auth.generateAppAccount(appId, mnemonic);
    // 获取用户信息，重新设置公钥
    const keymanager = new KeyManager();
    const privKey: Ed25519PrivKey = await keymanager.getEd25519KeyFromMnemonic(
      mnemonic,
      appId || ""
    );
    // 保存公钥到上下文中
    dc.setPublicKey(privKey.publicKey);
    if (appId == dcConfig.appInfo.appId) {
      window.showToast({
        content: i18n.t("account.init_user_db_ing"), // 初始化用户数据库中
        position: "center",
        duration: 0,
      });
      dc.setPrivateKey(privKey);
      // 获取token
      const [res, err] = await getToken(privKey.publicKey.string());
      try {
        // 设置threadDB
        await initUserDB();
      } catch (error) {
        console.error("initUserDB", error);
      }
    }
  } catch (error) {
    console.log("=================initUserDB error", error);
  }
  walletAccount = null; // 清除钱包账号
  window.showToast({
    content: i18n.t("register.success"), // todo
    position: "center",
  });
  return {
    success: true,
  };
}
// 创建账号(登录)
async function createAccountWithLogin(
  account: string,
  password: string,
  safecode: string,
  origin?: string
): Promise<{
  success: boolean;
  data: AccountInfo | null;
  error?: Error | null;
}> {
  try {
    const dc = getDC();
    if (!dc) {
      return;
    }
    const appInfo = store.getState().auth.appInfo || null;
    if (
      !dc.appInfo ||
      !dc.appInfo.appId ||
      dc.appInfo.appId !== appInfo?.appId
    ) {
      dc.setAppInfo(appInfo);
    }
    const [mnemonic, err] = await dc.auth.accountLogin(
      account,
      password,
      safecode
    );
    console.log("=================dc.auth.accountLogin res");
    if (err || !mnemonic) {
      console.log("=================dc.auth.accountLogin error");
      return;
    }
    // 登录成功，得到私钥
    // 助记词信息， 私钥转助记词
    const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
    console.log("=================createWalletAccountWithMnemonic success");
    const address = wallet.address;
    const accountInfo = await createAccount(mnemonic, account, address);
    console.log("=================createAccount success");
    if (!accountInfo) {
      return;
    }
    if (dc) {
      const appInfo = store.getState().auth.appInfo || null;
      const appId = appInfo?.appId;
      // 获取用户信息，重新设置公钥
      const keymanager = new KeyManager();
      const privKey: Ed25519PrivKey =
        await keymanager.getEd25519KeyFromMnemonic(mnemonic, appId);
      if (appId === dcConfig.appInfo.appId) {
        window.showToast({
          key: "initUserDB",
          content: i18n.t("account.init_user_db_ing"), // "初始化用户数据库中"
          position: "center",
          duration: 0,
        });
        dc.setPrivateKey(privKey);
        // 设置threadDB
        await initUserDB();
        window.clearToast();
      }
    }
    if (origin) {
      const message: ConnectReqMessage = {
        origin: origin || "",
      };
      const res = await resPonseWallet(
        mnemonic,
        accountInfo,
        origin ? messageData : message,
        true,
        portData
      );
      return res;
    } else {
      return await resPonseWallet(mnemonic, accountInfo);
    }
  } catch (error) {
    console.log("createAccountWithLogin error", error);
    return;
  }
}

export {
  initCommChannel,
  connectCmdHandler,
  createAccountWithLogin,
  createAccountWithRegister,
};
