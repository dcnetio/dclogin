"use client";
import ethersHelper from "@/helpers/ethersHelper";
import { NetworkStauts } from "@/config/constant";

// 数据库
import DBHelper from "@/helpers/DBHelper";
import i18n from "@/locales/i18n";
import { getCurrentNetwork, getNetworkStatus, switchChain } from "../network";
import { generateWalletAccount } from "../account/wallet";
import { getCurrentAccount } from "../account/state";

// 转账
async function transfer(
  to: string,
  amount: string,
  gasLimit: number,
  gasPrice: string
) {
  const currentChain = getCurrentNetwork();
  const networkStatus = getNetworkStatus();
  if (currentChain == null || networkStatus != NetworkStauts.connected) {
    //待测试 跳出提示框,提示用户未连接登录中心
    window.showToast({
      content: i18n.t("account.wallet_not_connect"),
      position: "center",
    });
    return;
  }
  const currentAccount = getCurrentAccount();
  if (currentAccount == null) {
    //待测试 跳出提示框,提示用户没有可用账号
    window.showToast({
      content: i18n.t("account.no_account"),
      position: "center",
    });
    return;
  }
  const wallet = await generateWalletAccount(currentAccount.account);
  if (!wallet) {
    return;
  }
  try {
    // 执行转账
    const txResponse = await ethersHelper.transfer(
      wallet,
      to,
      amount,
      gasLimit,
      gasPrice
    );
    if (!txResponse || !txResponse.hash || !txResponse.provider) {
      //待测试 跳出提示框,提示用户转账失败
      window.showToast({
        content: i18n.t("transfer.transfer_failed"),
        position: "center",
      });
      return;
    }
    const record = {
      chainId: txResponse.chainId ? Number(txResponse.chainId) : "",
      hash: txResponse.hash || "",
      index: txResponse.index || "",
      blockNumber: txResponse.blockNumber || "",
      blockHash: txResponse.blockHash || "",
      from: txResponse.from || "",
      to: txResponse.to || "",
      value: txResponse.value ? Number(txResponse.value) : "",
      data: txResponse.data || "",
      gasLimit: txResponse.gasLimit ? Number(txResponse.gasLimit) : "",
      gasPrice: txResponse.gasPrice || "",
      gasUsed: 0,
      blobGasUsed: 0,
      type: txResponse.type,
      contractAddress: "",
      status: 2, //0:失败,1:成功,2:等待确认
      timestamp: new Date().getTime(),
    };
    await DBHelper.addData(DBHelper.store_record, record);
    // 等待转账成功
    const receipt = await ethersHelper.waitTransactionConfirm(
      txResponse,
      currentChain.confirms
    );
    if (!receipt) {
      //待测试 界面提示用户转账待确认
      window.showToast({
        content: i18n.t("transfer.transfer_pending"),
        position: "center",
      });
      return;
    }
    record.blockNumber = receipt.blockNumber;
    record.blockHash = receipt.blockHash;
    record.gasPrice = receipt.gasPrice;
    record.gasUsed = receipt.gasUsed ? Number(receipt.gasUsed) : 0;
    record.blobGasUsed = receipt.blobGasUsed ? Number(receipt.blobGasUsed) : 0;
    record.status = 1;
    record.timestamp = new Date().getTime();
    DBHelper.updateData(DBHelper.store_record, record);
    //待测试 界面提示转账成功
    window.showToast({
      content: i18n.t("transfer.transfer_success"),
      position: "center",
    });
    return true;
  } catch (error) {
    console.log("transfer error", error);
    return false;
  }
}

//刷新指定交易记录状态,用户点击状态为等待中的交易记录时,调用此方法
async function refreshRecordStatus(hash: string) {
  //从数据库中获取交易记录
  const record = await DBHelper.getData(DBHelper.store_record, hash);
  if (!record) {
    //待测试 跳出提示框,提示用户获取交易记录失败
    window.showToast({
      content: i18n.t("transfer.get_transferlist_failed"),
      position: "center",
    });
    return;
  }
  const currentChain = getCurrentNetwork();
  if (currentChain == null || currentChain.chainId != record.chainId) {
    //todo 跳出提示框,开始切换网络
    //数据库查出网络信息
    const chainInfo = await DBHelper.getData(
      DBHelper.store_chain,
      record.chainId
    );
    const flag = switchChain(chainInfo);
    if (!flag) {
      //待测试 跳出提示框,提示用户切换网络失败
      window.showToast({
        content: i18n.t("network.switch_failed"),
        position: "center",
      });
      return;
    }
  }
  const receipt = await ethersHelper.checkTransactionStatus(hash);
  record.gasUsed = receipt?.gasUsed;
  record.blobGasUsed = receipt?.blobGasUsed;
  record.status = receipt?.status;
  record.timestamp = new Date().getTime();
  DBHelper.updateData(DBHelper.store_record, record);
}

export { transfer, refreshRecordStatus };
