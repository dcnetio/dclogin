"use client";
import utilHelper from "@/helpers/utilHelper";
import ethersHelper from "@/helpers/ethersHelper";
import { MsgStatus } from "@/config/constant";
import { store } from "@/lib/store";
import { updateAuthStep } from "@/lib/slices/authSlice";
import { AccountInfo, ConnectReqMessage } from "../types/walletTypes";
import type {
  APPInfo,
} from "web-dc-api";
import {
  KeyManager,
  NFTBindStatus,
  Ed25519PrivKey,
} from "web-dc-api";
// 数据库
import DBHelper from "@/helpers/DBHelper";
import {
  showEncodePassword,
  showSetEncodePassword,
} from "@/components/note/noteHelper";
import i18n from "@/locales/i18n";
import { getCurrentChain, getCurrentNetwork } from "./networkService";
import { getDC } from "@/components/auth/login/dc";
// 定义一个变量，用于存储BroadcastChannel对象
let currentAccount: AccountInfo | null = null; //当前账号

// 获取已有的账号
async function chooseStoredAccount(): Promise<AccountInfo | null> {
  if (currentAccount) {
    console.log("currentAccount 已经存在", currentAccount);
    return currentAccount;
  }
  //判断用户是否已经创建过钱包账号,如果没有,则跳出状态等待框,提示用户账号创建中
  const accounts = await DBHelper.getAllData(DBHelper.store_account);
  if (!accounts || accounts.length == 0) {
    return null;
  }
  const accountinfo = await DBHelper.getData(
    DBHelper.store_keyinfo,
    "choosedAccount"
  );
  if (accountinfo && accountinfo.value) {
    // 更新当前账号
    await DBHelper.updateData(DBHelper.store_keyinfo, {
      key: "choosedAccount",
      value: accounts[accounts.length - 1],
    });
  } else {
    await DBHelper.addData(DBHelper.store_keyinfo, {
      key: "choosedAccount",
      value: accounts[accounts.length - 1],
    });
  }
  currentAccount = accounts[accounts.length - 1];
  return currentAccount;
}

const bindNFTAccount = async (
  account: string = "",
  password: string = "",
  safecode: string = "",
  mnemonic: string = "",
  pubKeyStr: string = ""
): Promise<[boolean, Error | null]> => {
  const dc = getDC();
  if (!dc) {
    return [false, new Error(i18n.t("account.bind_nft_account_fail"))];
  }
  const [bindStatus, err] = await dc.auth.bindNFTAccount(
    account,
    password,
    safecode,
    mnemonic
  );
  if (err || bindStatus !== NFTBindStatus.Success) {
    return [false, err || new Error(i18n.t("account.bind_nft_account_fail"))];
  }
  // 循环checkNFT绑定状态
  const checkFlag = await _checkBind(account, pubKeyStr);
  if (!checkFlag) {
    return [false, new Error(i18n.t("account.bind_nft_account_timeout"))];
  }
  return [true, null];
};

const _checkBind = (account: string, pubKeyStr: string) => {
  const maxNum = 20;
  let interval: any = null, // 定时器
    intervalNum = 0; // 定时判断是否绑定成功
  return new Promise((resolve) => {
    const dc = getDC();
    if (!dc) {
      resolve(false);
      return;
    }
    // 初始化定时器
    if (interval) {
      clearInterval(interval);
    }
    intervalNum = 0;
    interval = setInterval(async () => {
      intervalNum++;
      // 判断是否绑定成功
      const [bindFlag, err] = await dc.auth.isNftAccountBindSuccess(
        account,
        pubKeyStr
      );
      if (!err && bindFlag) {
        // 绑定成功停止定时任务
        clearInterval(interval);
        intervalNum = 0;
        resolve(true);
      } else if (intervalNum > maxNum) {
        // 超时停止定时任务
        clearInterval(interval);
        intervalNum = 0;
        resolve(false);
      }
    }, 1000);
  });
};

// 创建账号
async function createAccount(
  mnemonic: string | null = null,
  nftAccount: string,
  address: string = "",
  connectingApp: APPInfo | null = null
) {
  let accounts: AccountInfo[] = [];
  try {
    //待测试 跳出状态等待框,提示用户账号创建中，需要手动关闭
    // 保存用户信息
    const account = await createWalletAccount(mnemonic, nftAccount, address);
    console.log("11111111111111111111account 创建", account);
    //待测试 关闭状态等待框
    window.clearToast();
    if (!account) {
      return;
    }
    //待测试 跳出账号创建成功提示框
    window.showToast({
      content: i18n.t("account.create_success"),
      position: "bottom",
    });
    accounts.push(account);
  } catch (e) {
    console.error("获取账号信息失败:", e);
    //待测试 跳出提示框,提示用户创建账号失败
    window.showToast({
      content: i18n.t("account.create_failed"),
      position: "bottom",
    });
    return;
  }
  const accountinfo = await DBHelper.getData(
    DBHelper.store_keyinfo,
    "choosedAccount"
  );
  if (accountinfo && accountinfo.value) {
    // 更新当前账号
    await DBHelper.updateData(DBHelper.store_keyinfo, {
      key: "choosedAccount",
      value: accounts[accounts.length - 1],
    });
  } else {
    await DBHelper.addData(DBHelper.store_keyinfo, {
      key: "choosedAccount",
      value: accounts[accounts.length - 1],
    });
  }
  currentAccount = accounts[accounts.length - 1];
  return currentAccount;
}

// 获取用户加密密码
async function getEncodePwd(info: {
  iv: Uint8Array;
  encodeMnimonic: ArrayBuffer;
  credentialId?: string;
}): Promise<ArrayBuffer | null> {
  return new Promise((resolve) => {
    const dc = getDC();
    if (!dc) {
      resolve(null);
    }
    // todo 显示用户加密密码页面
    const connectingApp: APPInfo | null = dc?.appInfo || null;
    const appInfo = {
      appId: connectingApp.appId || "",
      appName: connectingApp.appName || "",
      appIcon: connectingApp.appIcon || "",
      appUrl: connectingApp.appUrl || "",
      appVersion: connectingApp.appVersion || "",
    };
    showEncodePassword(info, appInfo, (userHandleHash: ArrayBuffer | null) => {
      // 处理结果
      resolve(userHandleHash);
    });
  });
}

// 设置用户加密密码
async function setEncodePwd(): Promise<[Uint8Array | null, string | null]> {
  return new Promise((resolve) => {
    showSetEncodePassword((userHandle: Uint8Array | null, credentialId: string | null) => {
      // 处理结果
      resolve([userHandle, credentialId]);
    });
  });
}
// 根据账号,生成签名的钱包账号对象
async function generateWalletAccount(seedAccount: string) {
  let account = null;
  // 数据库里获取账号信息
  try {
    account = await DBHelper.getData(DBHelper.store_account, seedAccount);
    if (account == null) {
      //待测试 跳出提示框,提示钱包里的用户账号不存在
      window.showToast({
        content: i18n.t("account.wallet_no_account"),
        position: "bottom",
      });
      return null;
    }
  } catch (e) {
    console.error("获取账号信息失败:", e);
    //待测试 跳出提示框,提示用户获取账号信息失败
    window.showToast({
      content: i18n.t("account.get_info_failed"),
      position: "bottom",
    });
    return null;
  }

  //跳出密码设置框,提示用户输入密码加密
  const userHandleHash = await getEncodePwd({
      iv: account.iv,
      encodeMnimonic: account.mnemonic,
      credentialId: account.credentialId || "",
  });
  if (!userHandleHash) {
    //待测试 跳出提示框,提示用户解锁钱包失败
    window.showToast({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
    return;
  }
  //解密出助记词
  const mnemonic = await utilHelper.decryptMnemonic(
    account.iv,
    account.mnemonic,
    userHandleHash
  );
  if (!mnemonic) {
    //待测试 跳出提示框,提示用户导入钱包失败
    window.showToast({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
  }
  const dc = getDC();
  if (dc) {
    const connectingApp = dc.appInfo;
    if (connectingApp && connectingApp.appId) {
      await dc.auth.generateAppAccount(connectingApp.appId, mnemonic);
    }
  }
  // 通过助记词导入钱包,生成带私钥钱包账号
  const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
  if (!wallet) {
    //待测试 跳出提示框,提示用户导入钱包失败
    window.showToast({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
  }
  return wallet;
}


// 创建钱包账号
async function createWalletAccount(
  mnemonic: string | null = null,
  nftAccount: string,
  address: string = ""
): Promise<AccountInfo | null> {
  let resAccount: AccountInfo | null = null;
  if (mnemonic) {
    try {
      const [userHandle, credentialId] = await setEncodePwd();
      if (!userHandle) {
        return null;
      }
      // 提取 userHandle 并进行 hash
      const userHandleHash = await crypto.subtle.digest("SHA-256", userHandle as any);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      //用userHandleHash 生成aes256的密钥,来加密accountInfo.mnemonic
      const encryptedMnemonic = await utilHelper.encryptMnemonic(
        iv,
        mnemonic,
        userHandleHash
      );
      //将账号信息(助记词)存储到数据库
      const account = {
        nftAccount,
        account: address,
        type: "eth", // todo 账号类型
        credentialId: credentialId || "",
        mnemonic: encryptedMnemonic,
        iv: iv,
        name: address.substring(0, 6),
        timeStamp: new Date().getTime(),
      };
      resAccount = account as AccountInfo;
      // 清空其他账号信息
      await DBHelper.clearData(DBHelper.store_account);
      const res = await DBHelper.updateData(DBHelper.store_account, account);
      console.log("账号信息存储成功", res);
      const dc = getDC();
      if (dc && dc.shouldReturnUserInfo) {
        // 存储到dc
        dc.setAccountInfo(resAccount);
      }
      return resAccount;
    } catch (e) {
      console.error("账号信息加密失败:", e);
      return null;
    }
  } else {
    return null;
  }
}


// 使用 Passkey 进行身份验证,并提取出userHandleHash
async function authenticateWithPasskey(credentialId: string) {
  const challenge = window.crypto.getRandomValues(new Uint8Array(32));

  const arrayBuffer = utilHelper.base64UrlToArrayBuffer(credentialId);
  if (!arrayBuffer) {
    return null;
  }
  const publickeyrType: PublicKeyCredentialType = "public-key";
  const required: UserVerificationRequirement = "required";
  const credentialidBuffer = arrayBuffer;
  const getCredentialOptions = {
    challenge: challenge,
    rpId: window.location.hostname,
    allowCredentials: [
      {
        id: credentialidBuffer,
        type: publickeyrType,
      },
    ],
    userVerification: required,
    timeout: 60000,
    extensions: {
      hmacCreateSecret: true,
    },
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: getCredentialOptions,
    });
    if (!assertion) {
      return null;
    }
    // 检查 assertion 中的扩展数据
    const clientExtensionResults = (
      assertion as PublicKeyCredential
    ).getClientExtensionResults();
    console.log("HMAC Secret Used:", clientExtensionResults.hmacCreateSecret);
    console.log("Authentication successful");
    const response = (assertion as PublicKeyCredential)
      .response as AuthenticatorAssertionResponse;
    console.log("response12 successful", response);
    console.log(
      "response.authenticatorData successful",
      new TextDecoder("utf-8").decode(response.authenticatorData)
    );
    console.log(
      "response.clientDataJSON successful",
      new TextDecoder("utf-8").decode(response.clientDataJSON)
    );
    console.log(
      "response.signature successful",
      new TextDecoder().decode(response.signature)
    );
    console.log(
      "response.userHandle successful",
      response.userHandle
        ? new TextDecoder("utf-8").decode(response.userHandle)
        : "没有response.userHandle"
    );
    if (response.userHandle) {
      const userHandleHash = await crypto.subtle.digest(
        "SHA-256",
        response.userHandle
      );
      return userHandleHash;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Authentication failed", error);
    return null;
  }
}


const getCurrentAccount = (): AccountInfo | null => {
  return currentAccount;
};

const setCurrentAccount = (account: AccountInfo) => {
  currentAccount = account;
};


// 解锁钱包并返回数据信息
async function unlockWallet(chooseAccount: AccountInfo) {
  // 获取当前网络
  const chain = await getCurrentChain();
  const currentChain = getCurrentNetwork();
  if (!chain || !currentChain) {
    //待测试 跳出提示框,提示用户获取网络信息失败
    store.dispatch(
      updateAuthStep({
        type: MsgStatus.failed,
        content: i18n.t("network.get_failed"),
      })
    );
    return;
  }
  //跳出密码设置框,提示用户输入密码加密
  const userHandleHash = await getEncodePwd({
    iv: chooseAccount.iv,
    encodeMnimonic: chooseAccount.mnemonic,
    credentialId: chooseAccount.credentialId || "",
  });
  if (!userHandleHash) {
    //跳出提示框,提示用户解锁钱包失败
    // store.dispatch(
    //   updateAuthStep({
    //     type: MsgStatus.failed,
    //     content: i18n.t("account.unlock_wallet_failed"),
    //   })
    // );
    return;
  }
  //解密出助记词
  const mnemonic = await utilHelper.decryptMnemonic(
    chooseAccount.iv,
    chooseAccount.mnemonic,
    userHandleHash
  );
  if (!mnemonic) {
    store.dispatch(
      updateAuthStep({
        type: MsgStatus.failed,
        content: i18n.t("account.unlock_wallet_failed"),
      })
    );
    return;
  }
  return mnemonic;
}

async function resPonseWallet(
  mnemonic: string,
  message: ConnectReqMessage = {} as ConnectReqMessage,
  bool: boolean = false,
  port: MessagePort | null = null
) {
  const currentChain = getCurrentNetwork();
  if (!currentChain) {
    //待测试 跳出提示框,提示用户获取网络信息失败
    store.dispatch(
      updateAuthStep({
        type: MsgStatus.failed,
        content: i18n.t("network.get_info_failed"),
      })
    );
    return;
  }
  let connectingApp = message.data;
  if (!connectingApp) {
    const dc = getDC();
    if(dc && dc.appInfo){
      connectingApp = dc.appInfo;
    }
  }
  // 通过助记词导入钱包,生成带私钥钱包账号
  const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
  if (!wallet) {
    //待测试 跳出提示框,提示用户解锁钱包失败
    store.dispatch(
      updateAuthStep({
        type: MsgStatus.failed,
        content: i18n.t("account.unlock_wallet_failed"),
      })
    );
    return;
  }
  const dc = getDC();
  if (!dc) {
    //待测试 跳出提示框,提示用户签名失败
    store.dispatch(
      updateAuthStep({
        type: MsgStatus.failed,
        content: i18n.t("sign.sign_failed"),
      })
    );
    return;
  }
  // 获取用户信息，判断是否有空间
  let publicKey = dc.publicKey;
  if (publicKey == null) {
    // DCAPP进入
    const keymanager = new KeyManager();
    const privKey: Ed25519PrivKey = await keymanager.getEd25519KeyFromMnemonic(
      mnemonic,
      connectingApp?.appId || ""
    );
    publicKey = privKey.publicKey;
    // todo保存公钥到上下文中
    dc.setPublicKey(publicKey);
  }
  // 执行签名
  const signature = await ethersHelper.signMessage(
    wallet,
    message.origin || ""
  );
  if (!signature) {
    //待测试 跳出提示框,提示用户签名失败
    store.dispatch(
      updateAuthStep({
        type: MsgStatus.failed,
        content: i18n.t("sign.sign_failed"),
      })
    );
    return;
  }
  if (bool) {
    // DCAPP进入
    const keymanager = new KeyManager();
    const privKey: Ed25519PrivKey = await keymanager.getEd25519KeyFromMnemonic(
      mnemonic,
      connectingApp?.appId || ""
    );
    //签名成功后,发送链接成功消息给APP
    const resMessage = {
      type: "connected",
      origin: message.origin,
      data: {
        nftAccount: currentAccount?.nftAccount,
        ethAccount: wallet.address,
        chainId: currentChain.chainId,
        chainName: currentChain.name,
        signature: signature,
        privateKey: privKey.raw,
        accountInfo: dc.accountInfo || {},
      },
    };
    if (!port) {
      console.error("messagePort is null");
      // 关闭当前窗口,并返回原来的窗口
      if (window.opener) {
        // 可以在原窗口中执行一些操作，例如导航
        window.opener.focus(); // 返回并聚焦到原窗口
      }
      window.close();
      return;
    }
    port.postMessage(resMessage);
    // 1秒后关闭port
    setTimeout(() => {
      port.close();
    }, 1000);
    // 连接记录存储到数据库
    const app = {
      appId: connectingApp?.appId,
      appName: connectingApp?.appName,
      appIcon: connectingApp?.appIcon,
      appUrl: connectingApp?.appUrl,
      appVersion: connectingApp?.appVersion,
      timestamp: new Date().getTime(),
    };
    DBHelper.updateData(DBHelper.store_apps, app)
      .then(() => {
        console.log("连接记录存储成功");
      })
      .catch((e) => {
        console.error("连接记录存储失败:", e);
      })
      .finally(() => {
        // 关闭当前窗口,并返回原来的窗口
        if (window.opener) {
          // 可以在原窗口中执行一些操作，例如导航
          window.opener.focus(); // 返回并聚焦到原窗口
        }
        window.close();
      });
  } else {
    // 钱包本身访问
    return {
      success: true,
      data: {
        nftAccount: currentAccount?.nftAccount,
        ethAccount: wallet.address,
        chainId: currentChain.chainId,
        chainName: currentChain.name,
        signature: signature,
      },
    };
  }
}

export {
  chooseStoredAccount,
  authenticateWithPasskey,
  getEncodePwd,
  generateWalletAccount,
  unlockWallet,
  resPonseWallet,
  getCurrentAccount,
  setCurrentAccount,
  createAccount,
  bindNFTAccount,
};