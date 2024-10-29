"use client";
import { ActivityItem } from "@/types/pageType";
import styles from "./info.module.css";
import { Toast } from "antd-mobile";
import TransItem from "@/components/transfer/transItem";
import { AccountInfo } from "@/types/walletTypes";
interface ActivityProps {
  info: ActivityItem;
  accountInfo: AccountInfo | undefined;
  currencySymbol: string;
}
export default function ActivityInfo(props: ActivityProps) {
  const { info, accountInfo, currencySymbol } = props;
  console.log("Activity info", info);

  const copy = () => {
    navigator.clipboard.writeText(info?.hash || "");
    Toast.show({
      content: "复制成功",
      position: 'bottom'
    });
  };
  return (
    <div>
      <div className={styles.header}>
      发送
      </div>
      <div className={styles.content}>
        <div className={styles.info}>
          <div>
            <div className={styles.type}>发送</div>
            <div className={styles.status}>已确认</div>
          </div>
          <div>
            {/* <div className={styles.href}>添加区块浏览器</div> */}
            <div className={styles.href} onClick={copy}>复制交易ID</div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.bold}>自</div>
          <div className={styles.bold}>至</div>
        </div>
        <TransItem fromItem={accountInfo} to={info?.to}/>
        <div className={styles.info}>
          <div className={styles.bold}>交易</div>
        </div>
        <div className={styles.info}>
          <div className={styles.greyTxt}>Nonce</div>
          <div className={styles.bold}>{info?.blockNumber}</div>
        </div>
        <div className={styles.info}>
          <div className={styles.greyTxt}>数额</div>
          <div className={styles.greyTxt}>{(Number(info.value) / 10000000000 / 100000000).toFixed(4)} {currencySymbol}</div>
        </div>
        <div className={styles.info}>
          <div className={styles.greyTxt}>交易时间</div>
          <div className={styles.greyTxt}>
            {info?.timestamp ? new Date(info?.timestamp).toLocaleString() : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
