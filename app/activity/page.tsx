"use client";
import { CenterPopup, ErrorBlock, List, Space } from "antd-mobile";
import { useEffect, useState } from "react";
import { queryData, store_record } from "@/helpers/DBHelper";
import { getCurrentAccount, getCurrentNetwork } from "@/app/index";
import { AccountInfo, ChainInfo } from "@/types/walletTypes";
import styles from "./page.module.css";
import { ActivityItem } from "@/types/pageType";
import ActivityInfo from "./components/info";
import { useAppSelector } from "@/lib/hooks";
import { appState } from "@/config/constant";
export default function ActivityList({}) {
  const initState = useAppSelector((state) => state.app.initState);
  const [list, setList] = useState<ActivityItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<ActivityItem>();
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const getActivity = async () => {
    const network: ChainInfo | null = getCurrentNetwork();
    if (!network) {
      return;
    }
    setCurrencySymbol(network.currencySymbol);
    const currentAccount: AccountInfo | null = getCurrentAccount();
    if (!currentAccount) {
      return;
    }
    setAccountInfo(currentAccount);
    const data =
      (await queryData(store_record, "from", currentAccount?.account)) || [];
    const list = data.filter(
      (item: ActivityItem) => Number(item.chainId) == Number(network?.chainId)
    );
    list.sort((a: ActivityItem, b: ActivityItem) => b.timestamp - a.timestamp);

    setList(list);
  };

  const gotoDetail = async (item: ActivityItem) => {
    setVisible(true);
    setInfo(item);
  };
  useEffect(() => {
    getActivity();
  }, []);
  useEffect(() => {
    if (initState == appState.init_success) {
      getActivity();
    }
  }, [initState]);
  return (
    <div>
      <List>
        {list.map((item: ActivityItem, index) => (
          <List.Item
            key={"network" + index}
            arrowIcon={false}
            clickable
            onClick={() => gotoDetail(item)}
          >
            <div className={styles.itemD}>
              <div className={styles.time}>
                {new Date(item.timestamp).toLocaleString()}
              </div>
              <div className={styles.item}>
                <div>
                  <div className={styles.type}>发送</div>
                  <div className={styles.statusFail}>
                    {item.status == 0 ? "失败" : ""}
                  </div>
                  <div className={styles.statusSuccess}>
                    {item.status == 1 ? "已确认" : ""}
                  </div>
                  <div className={styles.statusPending}>
                    {item.status == 0 ? "待处理" : ""}
                  </div>
                </div>
                <div>
                  <div className={styles.amount}>
                    {-(Number(item.value) / 10000000000 / 100000000).toFixed(4)}{" "}
                    {currencySymbol}
                  </div>
                  <div className={styles.gas}>-</div>
                </div>
              </div>
            </div>
          </List.Item>
        ))}
      </List>
      {list.length == 0 && (
          <ErrorBlock status="default" className={styles.empty} title="暂无数据" fullPage={true}/>
      )}
      <CenterPopup
        showCloseButton
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}
        style={{
          "--min-width": "320px",
        }}
      >
        {info ? (
          <ActivityInfo
            info={info}
            accountInfo={accountInfo}
            currencySymbol={currencySymbol}
          />
        ) : (
          <>暂无数据</>
        )}
      </CenterPopup>
    </div>
  );
}
