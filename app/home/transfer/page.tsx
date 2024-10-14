"use client";
import { Button, Dialog, Input, Toast } from "antd-mobile";
import styles from "./transfer.module.css";
import { useAppSelector } from "@/lib/hooks";
import { useState } from "react";
export default function Transfer() {
  const [address, setAddress] = useState("");
  const accountInfo = useAppSelector(state => state.wallet.account)
  const transferBN = async () => {
    // 确认框
    await Dialog.confirm({
      content: <div>是否转账到账号：<div  className={styles.address}>{address}</div></div>,
      confirmText: '确认',
      cancelText: '取消',
      onConfirm: () => {
        console.log("transferBN");
        // todo 调用js转账，需要auth认证
        Toast.show({
          content: "转账成功",
          position: "bottom",
        })
      },
    })
  }
  return (
    <div className={styles.content}>
      <p>自</p>
      <div className={styles.account}>{accountInfo.name}</div>
      <p>至</p>
      <div className={styles.account}>
        <Input placeholder="输入公钥或者地址" value={address} onChange={setAddress} onEnterPress={transferBN} clearable />
      </div>
      <div className={styles.btnD}>
        <div className={styles.btn}>
          <Button color="primary" fill="outline" block>
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
