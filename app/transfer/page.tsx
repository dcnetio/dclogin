"use client";
import { Button, Dialog, Ellipsis, Input, Toast } from "antd-mobile";
import styles from "./transfer.module.css";
import { useEffect, useState } from "react";
import { AccountInfo } from "@/types/walletTypes";
import ethers from "@/helpers/ethersHelper";
import { getCurrentAccount, transfer } from "@/app/index";
import { useRouter } from "next/navigation";
export default function Transfer() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const transferBN = async () => {
    if (!balance || !amount) {
      Toast.show({
        content: "请输入转账信息",
        position: "bottom",
      });
      return;
    }
    // 确认框
    await Dialog.confirm({
      content: (
        <div>
          确认账号：<div className={styles.address}>确认给{address}转账{amount}</div>
        </div>
      ),
      confirmText: "确认",
      cancelText: "取消",
      onConfirm: async () => {
        console.log("transferBN");
        // todo 调用js转账，需要auth认证
        const res = await transfer(
          address,
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
  const getNowAccount = async () => {
    const info = getCurrentAccount();
    console.log("getCurrentAccount info", info);
    if (info) {
      setAccountInfo(info);
      const nb =
        (await ethers.getUserBalance(info?.account || "")) || "0";
      setBalance(nb);
    }
  };

  useEffect(() => {
    getNowAccount();
  }, []);
  return (
    <div className={styles.content}>
      <p>自</p>
      <div className={styles.account}>
        <div className={styles.title}>{accountInfo?.name}</div>
        <Ellipsis
          direction="middle"
          content={accountInfo?.account || ""}
          className={styles.txt}
        />
        <div className={styles.balance}>当前余额：{balance}</div>
      </div>
      <p>至</p>
      <div className={styles.input}>
        <Input
          placeholder="输入公钥或者地址"
          value={address}
          onChange={setAddress}
          onEnterPress={transferBN}
          clearable
        />
      </div>
      <div className={styles.input}>
        <Input
          placeholder="输入转账数量"
          value={amount}
          onChange={setAmount}
          onEnterPress={transferBN}
          clearable
        />
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
            继续
          </Button>
        </div>
      </div>
    </div>
  );
}
