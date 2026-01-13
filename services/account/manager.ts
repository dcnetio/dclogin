"use client";
import DBHelper from "@/helpers/DBHelper";
import { AccountInfo } from "@/types/walletTypes";
import i18n from "@/locales/i18n";
import { createWalletAccount, generateWalletAccountWithChange } from "./wallet";
import { getCurrentAccount, setCurrentAccount } from "./state";

// 获取已有的账号
async function chooseStoredAccount(): Promise<AccountInfo | null> {
  const currentAccount = getCurrentAccount();
  if (currentAccount) {
    console.log("currentAccount 已经存在", currentAccount);
    return currentAccount;
  }
  //判断用户是否已经创建过登录中心账号,如果没有,则跳出状态等待框,提示用户账号创建中
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
    let index = accounts.findIndex(
      (item) => item.account === accountinfo.value.account
    );
    if (index === -1) {
      index = accounts.length - 1;
    }
    await DBHelper.updateData(DBHelper.store_keyinfo, {
      key: "choosedAccount",
      value: accounts[index],
    });
    setCurrentAccount(accounts[index]);
    return accounts[index];
  }
  await DBHelper.addData(DBHelper.store_keyinfo, {
    key: "choosedAccount",
    value: accounts[accounts.length - 1],
  });
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
    // 保存用户信息
    const account = await createWalletAccount(mnemonic, nftAccount, address);
    console.log("11111111111111111111account 创建", account);
    if (!account) {
      return;
    }
    //待测试 跳出账号创建成功提示框
    window.showToast({
      content: i18n.t("account.create_success"),
      position: "center",
    });
    accounts.push(account);
  } catch (e) {
    console.error("获取账号信息失败:", e);
    //待测试 跳出提示框,提示用户创建账号失败
    window.showToast({
      content: i18n.t("account.create_failed"),
      position: "center",
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

async function changeAccount(info: AccountInfo): Promise<boolean> {
  // 需要解密判断
  const wallet = await generateWalletAccountWithChange(info.account);
  if (!wallet) {
    return false;
  }
  await DBHelper.updateData(DBHelper.store_keyinfo, {
    key: "choosedAccount",
    value: info,
  });
  setCurrentAccount(info);
  return true;
}

// 获取所有的账号
async function getAllAccounts() {
  const accounts = await DBHelper.getAllData(DBHelper.store_account);
  return accounts;
}

/**
 * 删除账号
 * @param account
 */
async function deleteAccount(account: string) {
  await DBHelper.deleteData(DBHelper.store_account, account);
}
export {
  chooseStoredAccount,
  createAccount,
  changeAccount,
  getAllAccounts,
  deleteAccount,
};
