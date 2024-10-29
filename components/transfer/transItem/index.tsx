"use client";
import { Ellipsis } from 'antd-mobile';
import { useEffect } from 'react';
import styles from './index.module.css'
import { AccountInfo } from '@/types/walletTypes';
interface TransItemProps {
  fromItem: AccountInfo | undefined;
  to: string;
}
export default function TransItem(props: TransItemProps) {
  const {fromItem, to} = props;
  useEffect(() => {
  }, []);
 
  return (
    <div className={styles.info}>
    <Ellipsis
      direction="middle"
      content={fromItem?.account || ''}
      className={styles.account}
    />
    
    <Ellipsis
      direction="middle"
      content={to || ''}
      className={styles.account}
    />
    </div>
  );
}