"use client";
import { OpenInfo } from "@/types/pageType";
import styles from "./index.module.css";
import { Button } from "antd-mobile";
import {CheckShieldFill} from "antd-mobile-icons";

interface AddDAPPNoteProps {
  info: OpenInfo;
  confirmFun: () => void;
}
export default function AddDAPPNote(props: AddDAPPNoteProps) {
  const { info, confirmFun } = props;
  return (
    <div className={styles.page}>
      <div className={styles.icon}>
        <CheckShieldFill fontSize={48}/>
      </div>
      <div className={styles.title}>是否允许添加新的网络?</div>
      <div className={styles.content}>
        <div className={styles.url}>{info.appUrl}</div>
        <div className={styles.name}>
          应用：{info.appName} {info.appVersion}
        </div>
      </div>
      <div className={styles.note}>添加新网络前，请务必确认其安全性！</div>
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
            允许添加
          </Button>
        </div>
      </div>
    </div>
  );
}
