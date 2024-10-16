"use client";
import styles from "./transferConfirm.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import TransItem from "@/components/transItem";
import { useEffect, useState } from "react";
import { AccountInfo } from "@/types/walletTypes";
import { getCurrentAccount, transfer } from "@/app/index";
import GASItem from '@/components/gasItem'
import GASTotal from '@/components/gasTotal'
import { Button, Dialog, Toast } from "antd-mobile";
export default function TransferConfirm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "";
  const amount = searchParams.get("amount") || "";
  const currencySymbol = searchParams.get("currencySymbol") || "";
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const getUserBalance = async () => {
    const info = getCurrentAccount();
    console.log("getCurrentAccount info", info);
    if (info) {
      setAccountInfo(info);
    }
  };
  const transferBN = async () => {
    if (!amount) {
      Toast.show({
        content: "请输入转账信息",
        position: "bottom",
      });
      return;
    }
    // 确认框
    await Dialog.confirm({
      content: (
        <div className={styles.pop}>
          <div className={styles.sTitle}>确认转账：</div>
          <div className={styles.address}>确认给账户 {to} 转账 {amount} {currencySymbol}</div>
        </div>
      ),
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: async () => {
        console.log("transferBN");
        // todo 调用js转账，需要auth认证
        const res = await transfer(
          to,
          amount,
          21000, //todo gasLimit:
          '0.5' // todo gasPrice
        ); // gasPrice:
        if (res) {
          Toast.show({
            content: "转账成功",
            position: "bottom",
          });
          router.replace('/activity');
        } else {
          Toast.show({
            content: "转账失败",
            position: "bottom",
          });
        }
      },
    });
  };

  useEffect(() => {
    getUserBalance();
  }, []);
  return (
    <div>
      <TransItem fromItem={accountInfo} to={to} />
      <div className={styles.content}>
        <div className={styles.balanceD}>
          <div className={styles.tag}>
            正在发送{currencySymbol}
          </div>
          <div className={styles.balance}>{amount} {currencySymbol}</div>
        </div>
        <GASItem amount={amount} currencySymbol={currencySymbol}/>
        <GASTotal amount={amount} currencySymbol={currencySymbol}/>
      </div>
      <div className={styles.btnD}>
        <div className={styles.btn}>
          <Button
            color="primary"
            fill="outline"
            onClick={() => {
              router?.back();
            }}
            block
          >
            取消
          </Button>
        </div>
        <div className={styles.btn}>
          <Button color="primary" fill="solid" onClick={transferBN} block>
            确认
          </Button>
        </div>
      </div>
    </div>
  );
}
