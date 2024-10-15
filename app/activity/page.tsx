"use client";
import { CenterPopup, List } from "antd-mobile";
import { useEffect, useState } from "react";
// import { queryData, store_record } from "@/helpers/DBHelper";
import { useRouter } from "next/navigation";
// import { getCurrentAccount, getCurrentNetwork } from "@/app/index";
// import { AccountInfo, ChainInfo } from "@/types/walletTypes";
import styles from "./activity.module.css";
import { ActivityItem } from "@/types/pageType";
import ActivityInfo from "./compents/info";
export default function ActivityList({}) {
  const router = useRouter();
  const [list, setList] = useState<ActivityItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<ActivityItem>();
  const getActivity = async () => {
    // todo 临时测试
    const list = [
      {
        hash: "sadasdasdas",
        status: 1,
        chainId: "1",
        blockNumber: 1,
        value: 2,
        timestamp: new Date().getTime(),
        to: "account2",
        from: "account1",
      },
    ];
    setList(list);
    // const network: ChainInfo | null = getCurrentNetwork();
    // if(!network){
    //   return;
    // }
    // const accountInfo: AccountInfo | null = getCurrentAccount();
    // const data = await queryData(store_record, 'chainId', network?.chainId.toString()) || []
    // const list = data.filter((item: ActivityItem) => item.from === accountInfo?.account)
    // setList(list)
  };

  useEffect(() => {
    getActivity();
  }, []);
  const gotoDetail = async (item: ActivityItem) => {
    setVisible(true);
    setInfo(item);
  };
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
                  <div className={styles.status}>已确认</div>
                </div>
                <div>
                  <div className={styles.amount}>-1 DCT</div>
                  <div className={styles.gas}>-$0.0.7 USD</div>
                </div>
              </div>
            </div>
          </List.Item>
        ))}
      </List>
      <CenterPopup
        showCloseButton
        visible={visible}
        onMaskClick={() => {
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false)
        }}
        style={{
          "--min-width": "320px",
        }}
      >
        {info ? <ActivityInfo info={info} /> : <>暂无数据</>}
      </CenterPopup>
    </div>
  );
}
