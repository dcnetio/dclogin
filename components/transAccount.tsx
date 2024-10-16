"use client";
import { Ellipsis } from 'antd-mobile';
import { useEffect } from 'react';
import styles from './transAccount.module.css'
import { AccountInfo } from '@/types/walletTypes';
interface TransAccountProps {
  accountInfo: AccountInfo | undefined;
  balance: string;
  currencySymbol: string;
}
export default function TransAccount(props: TransAccountProps) {
  const {accountInfo, balance, currencySymbol} = props;
  useEffect(() => {
  }, []);
 
  return (
    <div className={styles.account}>
      <div className={styles.title}>{accountInfo?.name}</div>
      <Ellipsis
        direction="middle"
        content={accountInfo?.account || ""}
        className={styles.txt}
      />
      <div className={styles.balance}>当前余额：{balance} {currencySymbol}</div>
    </div>
  );
}