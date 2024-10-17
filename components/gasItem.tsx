"use client";
import { useEffect } from 'react';
import styles from './gasItem.module.css'
interface GASItemProps {
  amount: string | undefined;
  currencySymbol: string;
}
export default function GASItem(props: GASItemProps) {
  const {amount, currencySymbol} = props;
  useEffect(() => {
  }, []);
 
  return (
    <div className={styles.info}>
      <div className={styles.title}>预估费用</div>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.bold}>0.00</div>
          <div className={styles.txt}>{Number(amount) * 0.0000105}{currencySymbol}</div>
          <div className={styles.txt}>最大费用：{Number(amount) * 0.0000105}{currencySymbol}</div>
        </div>
      </div>
    </div>
  );
}