"use client";
import { getCurrentAccount } from "@/app";
import styles from "./index.module.css";
import { Button } from "antd-mobile";
import { CheckShieldFill } from "antd-mobile-icons";
import { useEffect, useState } from "react";
interface SignatureDAPPNoteProps {
  appUrl: string;
  msg: string | object;
  confirmFun: () => void;
}
export default function SignatureDAPPNote(props: SignatureDAPPNoteProps) {
  const { appUrl, msg, confirmFun } = props;
  const [account, setAccount] = useState("");
  useEffect(() => {
    const info = getCurrentAccount();
    if (info?.account) {
      setAccount(info.account);
    }
  }, []);
  return (
    <div className={styles.page}>
      <div className={styles.icon}>
        <CheckShieldFill fontSize={48} />
      </div>
      <div className={styles.title}>是否允许传入的信息进行签名?</div>
      <div className={styles.content}>
        <div>
          将对<div className={styles.url}>{appUrl}</div>发送的以下消息进行签名:
        </div>
        <div className={styles.name}>签名账号:{account}</div>
        <div className={styles.name}>签名消息:{JSON.stringify(msg)}</div>
      </div>
      <div className={styles.note}>确认开始签名前，请务必确认其安全性！</div>
      <div className={styles.btnD}>
        <div className={styles.btn}>
          <Button
            color="primary"
            fill="outline"
            onClick={() => {
              window.close();
            }}
            block
          >
            取消
          </Button>
        </div>
        <div className={styles.btn}>
          <Button color="primary" fill="solid" onClick={confirmFun} block>
            允许签名
          </Button>
        </div>
      </div>
    </div>
  );
}
