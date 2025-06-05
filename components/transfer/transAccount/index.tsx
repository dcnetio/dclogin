"use client";
import { Ellipsis } from 'antd-mobile';
import styles from './index.module.css'
import { AccountInfo } from '@/types/walletTypes';
import { useTranslation} from 'react-i18next';
interface TransAccountProps {
  accountInfo: AccountInfo | undefined;
  balance: string;
  currencySymbol: string;
}
export default function TransAccount(props: TransAccountProps) {
  const {accountInfo, balance, currencySymbol} = props;
  const {t} = useTranslation();
 
  return (
    <div className={styles.account}>
      <div className={styles.title}>{accountInfo?.name}</div>
      <Ellipsis
        direction="middle"
        content={accountInfo?.nftAccount || ""}
        className={styles.txt}
      />
      <div className={styles.balance}>{t('transfer.current_amount')}：{balance} {currencySymbol}</div>
    </div>
  );
}