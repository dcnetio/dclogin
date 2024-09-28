import { Ellipsis, Popup } from "antd-mobile";
import styles from "./header.module.css";
import Network from "@/components/network";
import Account from "@/components/account";
import { GlobalOutline, DownFill } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getCurrentAccount, getCurrentNetwork } from "@/app/home/home";
export default function Header({ changeNetworkSuccess, changeAccountSuccess }) {
  const [networkName, setNetworkName] = useState("");
  const [networkVisible, setNetworkVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [accountInfo, setAccountInfo] = useState({});
  const showChangeNetwork = () => {
    console.log("showChangeNetwork");
    setNetworkVisible(true);
  };
  const showChangeAccount = () => {
    console.log("showChangeAccount");
    setAccountVisible(true);
  }
  const onNetworkSuccess = async (name) => {
    setNetworkName(name);
    setNetworkVisible(false);
    changeNetworkSuccess && changeNetworkSuccess();
  };
  const onAccountSuccess = async () => {
    setAccountVisible(false);
    changeAccountSuccess && changeAccountSuccess();
  }
  const getNowNetwork = async () => {
    const info = getCurrentNetwork();
    if(info){
      setNetworkName(info.name);
    }
  }
  const getNowAccount = async () => {
    const info = getCurrentAccount();
    console.log('getCurrentAccount info', info)
    if(info){
      setAccountInfo(info);
    }
  }

  useEffect(() => {
    getNowNetwork();
    getNowAccount();
  }, [])
  return (
    <div className={styles.header}>
      <div className={styles.network} onClick={showChangeNetwork}>
        <GlobalOutline fontSize={16} />
        <span className={styles.txt}>{networkName ? networkName : "网络"}</span>
      </div>
      <div className={styles.accountD}>
        <div className={styles.account} onClick={showChangeAccount}>
          {accountInfo.name}
          <DownFill fontSize={12} className={styles.arrow} />
        </div>
        <Ellipsis
          direction="middle"
          content={accountInfo.address}
          className={styles.address}
        />
      </div>
      <Popup
        visible={networkVisible}
        onMaskClick={() => {
          setNetworkVisible(false);
        }}
        onClose={() => {
          setNetworkVisible(false);
        }}
        bodyClassName={styles.popup}
      >
        <Network onSuccess={onNetworkSuccess} />
      </Popup>
      <Popup
        visible={accountVisible}
        onMaskClick={() => {
          setAccountVisible(false);
        }}
        onClose={() => {
          setAccountVisible(false);
        }}
        bodyClassName={styles.popup}
      >
        <Account onSuccess={onAccountSuccess} />
      </Popup>
    </div>
  );
}
