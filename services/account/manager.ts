"use client";
import DBHelper from "@/helpers/DBHelper";
import { AccountInfo } from "@/types/walletTypes";
import i18n from "@/locales/i18n";
import { createWalletAccount } from "./wallet";
import { getCurrentAccount, setCurrentAccount } from "./state";

// 获取已有的账号
async function chooseStoredAccount(): Promise<AccountInfo | null> {
  const currentAccount = getCurrentAccount();
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
  const account = accounts[accounts.length - 1];
  setCurrentAccount(account);
  return account;
}

// 创建账号
async function createAccount(
  mnemonic: string | null = null,
  nftAccount: string,
  address: string = ""
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
  const account = accounts[accounts.length - 1];
  setCurrentAccount(account);
  return account;
}

export { chooseStoredAccount, createAccount };
