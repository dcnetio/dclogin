"use client";
import { Button, Input } from "antd-mobile";
import styles from "./transfer.module.css";
export default function Transfer() {
  return (
    <div className={styles.content}>
      <p>自</p>
      <div className={styles.account}>Account1</div>
      <p>至</p>
      <div className={styles.account}>
        <Input placeholder="输入公钥或者地址" clearable />
      </div>
      <div className={styles.btnD}>
        <div className={styles.btn}>
          <Button color="primary" fill="outline" block>
            取消
          </Button>
        </div>
        <div className={styles.btn}>
          <Button color="primary" fill="solid" block>
            继续
          </Button>
        </div>
      </div>
    </div>
  );
}
