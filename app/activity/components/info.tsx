"use client";
import { ActivityItem } from "@/types/pageType";
import styles from "./info.module.css";
import { Toast } from "antd-mobile";
import TransItem from "@/components/transfer/transItem";
import { AccountInfo } from "@/types/walletTypes";
import { useTranslation} from 'react-i18next';
interface ActivityProps {
  info: ActivityItem;
  accountInfo: AccountInfo | undefined;
  currencySymbol: string;
}
export default function ActivityInfo(props: ActivityProps) {
  const { info, accountInfo, currencySymbol } = props;
  console.log("Activity info", info);

  const { t } = useTranslation();

  const copy = () => {
    navigator.clipboard.writeText(info?.hash || "");
    Toast.show({
      content: t('activity.copy_success'),
      position: 'bottom'
    });
  };
  return (
    <div>
      <div className={styles.header}>
      {t('activity.send')}
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div>
            <div className={styles.type}>{t('activity.send')}</div>
            <div className={styles.status}>{t('status.confirmed')}</div>
          </div>
          <div>
            {/* <div className={styles.href}>添加区块浏览器</div> */}
            <div className={styles.href} onClick={copy}>{t('activity.copy_transaction_id')}</div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.bold}>{t('common.from')}</div>
          <div className={styles.bold}>{t('common.to')}</div>
        </div>
        <TransItem fromItem={accountInfo} to={info?.to}/>
        <div className={styles.info}>
          <div className={styles.bold}>{t('transfer.transaction')}</div>
        </div>
        <div className={styles.info}>
          <div className={styles.greyTxt}>Nonce</div>
          <div className={styles.bold}>{info?.blockNumber}</div>
        </div>
        <div className={styles.info}>
          <div className={styles.greyTxt}>{t('transfer.number')}</div>
          <div className={styles.greyTxt}>{(Number(info.value) / 10000000000 / 100000000).toFixed(4)} {currencySymbol}</div>
        </div>
        <div className={styles.info}>
          <div className={styles.greyTxt}>{t('transfer.transaction_time')}</div>
          <div className={styles.greyTxt}>
            {info?.timestamp ? new Date(info?.timestamp).toLocaleString() : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
