"use client";
import { getDC } from "@/components/auth/login/dc";
import i18n from "@/locales/i18n";
import { NFTBindStatus } from "web-dc-api";
import { AccountInfo, ConnectReqMessage } from "@/types/walletTypes";
import { unlockWallet } from "./wallet";
import { connectCmdHandler } from "../dapp";

const bindNFTAccount = async (
  account: string = "",
  password: string = "",
  safecode: string = "",
  mnemonic: string = "",
  pubKeyStr: string = ""
): Promise<[boolean, Error | null]> => {
  const dc = getDC();
  if (!dc) {
    return [false, new Error(i18n.t("account.auth_no_module"))];
  }
  const [bindStatus, err] = await dc.auth.bindNFTAccount(
    account,
    password,
    safecode,
    mnemonic
  );
  if (err || bindStatus !== NFTBindStatus.Success) {
    return [false, err || new Error(i18n.t("account.bind_nft_account_failed"))];
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

// 修改密码
async function changePassword(
  accountInfo: AccountInfo,
  newPassword: string,
  safecode: string
) {
  const dc = getDC();
  if (!dc) {
    return [false, new Error(i18n.t("account.auth_no_module"))];
  }
  const mnemonic = await unlockWallet(accountInfo);
  if (!mnemonic) {
    return;
  }
  const [success, error] = await dc.auth.nftAccountPasswordModify(
    accountInfo.nftAccount,
    newPassword,
    safecode,
    mnemonic
  );
  return [success, error];
}
async function login(): Promise<[AccountInfo | null, Error | null]> {
  //连接网络，并把用户信息保存下来
  const message: ConnectReqMessage = {
    origin: window.location.origin,
  };
  //改为判断是否有origin参数,如果有则表示是从DAPP打开的
  const res = await connectCmdHandler(message, false);
  console.log("res====", res);
  if (!res) {
    // 跳转到首页
    return [null, null];
  }
  if (res.success) {
    return [res.data, null];
  }
  return [null, res.error];
}

/**
 * 通过account 获取用户信息
 * @param account
 * @returns
 */
async function getUserInfoWithAccount(account: string) {
  const dc = getDC();
  if (!dc) {
    return [false, new Error(i18n.t("account.auth_no_module"))];
  }
  const [userInfo, err] = await dc.auth?.getUserInfoWithAccount(account);
  return [userInfo, err];
}

export { bindNFTAccount, changePassword, login, getUserInfoWithAccount };
