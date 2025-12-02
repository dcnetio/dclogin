import { Popup } from "antd-mobile";
import styles from "./index.module.css";
import Network from "@/components/common/network";
import Account from "@/components/common/account";
import { GlobalOutline, DownFill } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getCurrentAccount, getCurrentNetwork } from "@/app/index";
import { appState } from "@/config/constant";
import { AccountInfo } from "@/types/walletTypes";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  changeNetworkSuccess: () => void;
  changeAccountSuccess: () => void;
}

export default function Header(props: HeaderProps) {
  const { changeNetworkSuccess, changeAccountSuccess } = props;
  const { t } = useTranslation();
  const [networkName, setNetworkName] = useState("");
  const [networkVisible, setNetworkVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const [notificationCount, setNotificationCount] = useState(5); // 设置通知数量
  const initState = useAppSelector((state) => state.app.initState);

  const showChangeNetwork = () => {
    console.log("showChangeNetwork");
    setNetworkVisible(true);
  };

  const showChangeAccount = () => {
    console.log("showChangeAccount");
    setAccountVisible(true);
  };

  const onNetworkSuccess = async (name: string) => {
    setNetworkName(name);
    setNetworkVisible(false);
    changeNetworkSuccess?.();
    if (!accountInfo || !accountInfo.nftAccount) {
      getNowAccount();
    }
  };

  const onAccountSuccess = async (info: AccountInfo) => {
    setAccountInfo(info);
    setAccountVisible(false);
    changeAccountSuccess?.();
  };

  const getNowNetwork = async () => {
    const info = getCurrentNetwork();
    console.log("getCurrentNetwork info", info);
    if (info) {
      setNetworkName(info.name);
    }
  };

  const getNowAccount = async () => {
    const info = getCurrentAccount();
    if (info) {
      setAccountInfo(info);
    }
  };

  useEffect(() => {
    console.log("----initState", initState);
    if (initState == appState.init_success) {
      getNowNetwork();
      getNowAccount();
    }
  }, [initState]);

  return (
    <div className={styles.header}>
      {/* 账户下拉菜单 */}
      <div className={styles.accountDropdown}>
        <div className={styles.account} onClick={showChangeAccount}>
          <span className={styles.txt} style={{ color: "#333" }}>
            {accountInfo?.nftAccount
              ? accountInfo?.nftAccount
              : t("account.select_account", "选择账户")}
          </span>
          <DownFill fontSize={16} className={styles.accountDropdownIcon} />
        </div>
      </div>
      <div className={styles.right}>
        {/* 地球图标 */}
        <div className={styles.network} onClick={showChangeNetwork}>
          <GlobalOutline fontSize={16} style={{ color: "#333" }} />
        </div>
      </div>
      <Network onSuccess={onNetworkSuccess} visible={networkVisible} />

      <Account onSuccess={onAccountSuccess} visible={accountVisible} />
    </div>
  );
}
