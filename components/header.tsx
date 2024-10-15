import { Ellipsis, Popup } from "antd-mobile";
import styles from "./header.module.css";
import Network from "@/components/network";
import Account from "@/components/account";
import { GlobalOutline, DownFill } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getCurrentAccount, getCurrentNetwork } from "@/app/index";
import { appState } from "@/context/constant";
import { AccountInfo } from "@/types/walletTypes";
interface HeaderProps {
  changeNetworkSuccess: () => void;
  changeAccountSuccess: () => void;
}
export default function Header(props: HeaderProps) {
  const { changeNetworkSuccess, changeAccountSuccess } = props;
  const [networkName, setNetworkName] = useState("");
  const [networkVisible, setNetworkVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
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
    console.log("getCurrentAccount info", info);
    if (info) {
      setAccountInfo(info);
    }
  };

  useEffect(() => {
    console.log('----initState', initState)
    if (initState == appState.init_success) {
      getNowNetwork();
      getNowAccount();
    }
  }, [initState]);
  return (
    <div className={styles.header}>
      <div className={styles.network} onClick={showChangeNetwork}>
        <GlobalOutline fontSize={16} />
        <span className={styles.txt}>{networkName ? networkName.split(" ")[0] : "网络"}</span>
      </div>
      <div className={styles.accountD}>
        <div className={styles.account} onClick={showChangeAccount}>
          {accountInfo?.name}
          <DownFill fontSize={12} className={styles.arrow} />
        </div>
        <Ellipsis
          direction="middle"
          content={accountInfo?.account || ''}
          className={styles.account}
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
