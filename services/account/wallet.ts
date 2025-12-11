"use client";
import utilHelper from "@/helpers/utilHelper";
import ethersHelper from "@/helpers/ethersHelper";
import { MsgStatus } from "@/config/constant";
import { store } from "@/lib/store";
import { updateAuthStep } from "@/lib/slices/authSlice";
import { AccountInfo, ConnectReqMessage } from "@/types/walletTypes";
import { KeyManager, Ed25519PrivKey, Account } from "web-dc-api";
import DBHelper from "@/helpers/DBHelper";
import i18n from "@/locales/i18n";
import { getCurrentNetwork } from "../network";
import { getDC } from "@/components/auth/login/dc";
import { getCurrentAccount } from "./state";
import { getEncodePwd, setEncodePwd } from "./security";
import { saveAccountInfo } from "@/lib/slices/walletSlice";
import { addAuthRecord } from "./record";

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
  let userHandleHash = null;
  try {
    userHandleHash = await getEncodePwd({
      iv: account.iv,
      encodeMnimonic: account.mnemonic,
      credentialId: account.credentialId || "",
    });
    if (!userHandleHash) {
      window.showToast({
        content: i18n.t("account.unlock_wallet_cancel"),
        position: "bottom",
      });
      return;
    }
  } catch {
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
      const userHandleHash = await crypto.subtle.digest(
        "SHA-256",
        userHandle as any
      );
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
        type: "DCT", // todo 账号类型
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

// 解锁钱包并返回数据信息
async function unlockWallet(chooseAccount: AccountInfo) {
  // 获取当前网络
  // const chain = await getCurrentChain();
  // const currentChain = getCurrentNetwork();
  // if (!chain || !currentChain) {
  //   //待测试 跳出提示框,提示用户获取网络信息失败
  //   store.dispatch(
  //     updateAuthStep({
  //       type: MsgStatus.failed,
  //       content: i18n.t("network.get_failed"),
  //     })
  //   );
  //   return;
  // }
  //跳出密码设置框,提示用户输入密码加密
  let userHandleHash = null;
  try {
    userHandleHash = await getEncodePwd({
      iv: chooseAccount.iv,
      encodeMnimonic: chooseAccount.mnemonic,
      credentialId: chooseAccount.credentialId || "",
    });
    if (!userHandleHash) {
      //跳出提示框,提示用户解锁钱包失败
      return;
    }
  } catch (error) {
    console.error("getEncodePwd error", error);
    store.dispatch(
      updateAuthStep({
        type: MsgStatus.failed,
        content: i18n.t("account.unlock_wallet_failed"),
      })
    );
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
): Promise<{
  success: boolean;
  data: AccountInfo | null;
  error?: Error | null;
}> {
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
    if (dc && dc.appInfo) {
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
  const currentAccount = getCurrentAccount();
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
    // 存储授权记录
    const recordId = window.crypto.randomUUID();
    console.log("recordId:", recordId);
    await addAuthRecord({
      recordId: recordId,
      appId: connectingApp.appId,
      appName: connectingApp.appName,
      nftAccount: currentAccount?.nftAccount,
      account: wallet.address,
      timestamp: new Date().getTime(),
    });
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
    // 保存用户信息
    const toSaveAccountInfo = {
      url: currentAccount.url,
      name: currentAccount.name,
      nftAccount: currentAccount.nftAccount,
      account: currentAccount.account,
      credentialId: currentAccount.credentialId,
      timeStamp: currentAccount.timeStamp,
      type: currentAccount.type,
    };
    store.dispatch(saveAccountInfo(toSaveAccountInfo));
    return {
      success: true,
      data: currentAccount,
    };
  }
}

export {
  generateWalletAccount,
  createWalletAccount,
  unlockWallet,
  resPonseWallet,
};
