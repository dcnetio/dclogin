"use client";
import { useEffect } from 'react';
import styles from './gasTotal.module.css'
interface GASTotalProps {
  amount: string | undefined;
  currencySymbol: string;
}
export default function GASTotal(props: GASTotalProps) {
  const {amount, currencySymbol} = props;
  useEffect(() => {
  }, []);
 
  return (
    <div className={styles.info}>
      <div className={styles.titleD}>
      <div className={styles.title}>共计</div>
      <div className={styles.greyTxt}>金额 + 燃料费</div>
      </div>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.bold}>{Number(amount) * 1.0000105}{currencySymbol}</div>
          <div className={styles.txt}>最大金额：{Number(amount) * 1.0000105}{currencySymbol}</div>
        </div>
      </div>
    </div>
  );
}