import { Popover } from "antd-mobile";
import styles from "./index.module.css";
import Network from "@/components/common/network";
import Account from "@/components/common/account";
import {
  GlobalOutline,
  DownFill,
  LockOutline,
  UserOutline,
} from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getCurrentAccount, getCurrentNetwork } from "@/app/index";
import { appState } from "@/config/constant";
import { AccountInfo } from "@/types/walletTypes";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Action } from "antd-mobile/es/components/popover";

interface HeaderProps {
  changeNetworkSuccess: () => void;
  changeAccountSuccess: () => void;
}

export default function Header(props: HeaderProps) {
  const { changeNetworkSuccess, changeAccountSuccess } = props;
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [networkVisible, setNetworkVisible] = useState(false);
  const [accountVisible, setAccountVisible] = useState(false);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const initState = useAppSelector((state) => state.app.initState);

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const nextLang = currentLang.startsWith("zh") ? "en" : "zh";
    i18n.changeLanguage(nextLang);
  };

  const showChangeNetwork = () => {
    console.log("showChangeNetwork");
    setNetworkVisible(true);
  };

  const gotoChangePassword = () => {
    router.push("/changePassword");
  };

  const gotoChangeAccount = () => {
    console.log("gotoChangeAccount");
    // todo 跳转到账户管理页面
  };

  const showChangeAccount = () => {
    console.log("showChangeAccount");
    setAccountVisible(true);
  };

  const onNetworkSuccess = async () => {
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

  const actions: Action[] = [
    {
      key: "password",
      icon: <LockOutline />,
      text: t("changePassword.title", "修改密码"),
      onClick: gotoChangePassword,
    },
    {
      key: "account",
      icon: <UserOutline />,
      text: t("account.choose", "切换账号"),
      onClick: gotoChangeAccount,
    },
  ];
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
        {/* 语言切换按钮 */}
        <div onClick={toggleLanguage} style={{ marginRight: 16, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
           <span style={{ fontSize: 14, fontWeight: 'bold', color: '#333' }}>
             {i18n.language.startsWith("zh") ? "EN" : "中文"}
           </span>
        </div>

        {/* 地球图标 */}
        <div className={styles.network} onClick={showChangeNetwork}>
          <GlobalOutline fontSize={16} style={{ color: "#333" }} />
        </div>

        {/* 新增菜单按钮 - 使用 Popover 替代 Popover.Menu */}
        <Popover.Menu
          onAction={(node) => {
            if (node.onClick) node.onClick();
          }}
          actions={actions}
          placement="bottom-start"
          trigger="click"
        >
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginLeft: 12 }}>
            <Menu size={20} color="#333" />
          </div>
        </Popover.Menu>
      </div>

      {/* 网络选择器和账户信息组件保持不变 */}
      <Network onSuccess={onNetworkSuccess} visible={networkVisible} />
      <Account onSuccess={onAccountSuccess} visible={accountVisible} />
    </div>
  );
}
