"use client";
import { Ellipsis, Popup } from "antd-mobile";
import styles from "./header.module.css";
import Network from "@/components/network";
import Account from "@/components/account";
import { GlobalOutline, DownFill } from "antd-mobile-icons";
import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
export default function Header({ changeNetworkSuccess, changeAccountSuccess }) {
  const [networkVisible, setNetworkVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const accountInfo = useAppSelector((state) => state.wallet.account);
  const showChangeNetwork = () => {
    console.log("showChangeNetwork");
    setNetworkVisible(true);
  };
  const showChangeAccount = () => {
    console.log("showChangeAccount");
    setAccountVisible(true);
  }
  const onNetworkSuccess = async () => {
    setNetworkVisible(false);
    changeNetworkSuccess && changeNetworkSuccess();
  };
  const onAccountSuccess = async () => {
    setAccountVisible(false);
    changeAccountSuccess && changeAccountSuccess();
  }
  return (
    <div className={styles.header}>
      <div className={styles.network} onClick={showChangeNetwork}>
        <GlobalOutline fontSize={16} />
        <span className={styles.txt}>DC</span>
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
