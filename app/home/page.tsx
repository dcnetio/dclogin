"use client";
import styles from "./page.module.css"; // 确保引入了样式文件
import "antd-mobile/es/global";
import {
  SendOutline,
  AddOutline,
  LockOutline,
  // AppstoreOutline,
  LeftOutline,
  RightOutline,
} from "antd-mobile-icons";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/common/header";
import { useAppSelector } from "@/lib/hooks";
import { appState } from "@/config/constant";
import { getCurrentAccount, getCurrentNetwork } from "@/app/index";
import type { ChainInfo } from "@/types/walletTypes";
// import type { User } from "web-dc-api";
import { useTranslation } from "react-i18next";
import { Copy } from "lucide-react";

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const initState = useAppSelector((state) => state.app.initState);
  const [currencySymbol, setCurrencySymbol] = useState("");
  // const [isLoading, setIsLoading] = useState(true);
  const [accountName, setAccountName] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  // const [storageSpace, setStorageSpace] = useState("0 GB");
  // const [usedStorageSpace, setUsedStorageSpace] = useState("0 GB");
  // const [storagePercentage, setStoragePercentage] = useState(0);
  // const [tokenAmount, setTokenAmount] = useState("0");
  // const [isMobile, setIsMobile] = useState(true);
  const [activeView, setActiveView] = useState("account"); // "account" or "wallet"
  const [isConnecting, setIsConnecting] = useState(true); // 新增连接状态变量
  const [activeTab, setActiveTab] = useState("tokens"); // 添加 activeTab 状态变量并初始化

  useEffect(() => {
    const checkMobile = () => {
      // setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Navigation functions
  const goToWallet = () => {
    setActiveView("wallet");
  };

  const goToAccount = () => {
    setActiveView("account");
  };

  const sendBalance = () => {
    router.push("/transfer");
  };

  const gotoActivity = () => {
    router.push("/activity");
  };

  const buyTokens = () => {
    // Implement token purchase flow
    console.log("Buy tokens");
  };

  const upgradeStorage = () => {
    // Implement storage upgrade flow
    console.log("Upgrade storage");
  };

  const changeSuccess = async () => {
    // 切换成功后，获取账户信息
    getUserInfo();
  };
  // 获取用户信息的逻辑
  const getUserInfo = async () => {
    // setIsLoading(true);
    const accountInfo = getCurrentAccount();
    if (accountInfo && accountInfo.nftAccount) {
      setAccountAddress(accountInfo.account);
      setAccountName(accountInfo.nftAccount);

      const network: ChainInfo | null = getCurrentNetwork();
      if (!network) {
        // setIsLoading(false);
        return;
      }
      setCurrencySymbol(network.currencySymbol);

      // Simulate getting storage info from the DC API
      // if (dc && dc.auth) {
      //     const [userInfo, err] = await dc.auth.getUserInfoWithAccount(
      //       "0x" + accountInfo.account
      //     );
      //     if(err || !userInfo) {
      //       console.error("Failed to get user storage info", err);
      //       setStorageSpace("0 GB");
      //       setUsedStorageSpace("0 GB");
      //       setStoragePercentage(0);
      //       return;
      //     }
      //     console.log("User Info:", userInfo);
      //     if (userInfo && userInfo.subscribeSpace) {
      //       const totalSpaceGB = (userInfo.subscribeSpace / (1024 * 1024 * 1024)).toFixed(2);
      //       setStorageSpace(`${totalSpaceGB} GB`);

      //       // Mock used storage (30% of total for demo)
      //       const usedSpace = userInfo.subscribeSpace * 0.3;
      //       const usedSpaceGB = (usedSpace / (1024 * 1024 * 1024)).toFixed(2);
      //       setUsedStorageSpace(`${usedSpaceGB} GB`);
      //       setStoragePercentage(30);

      //       // Mock token amount
      //       setTokenAmount("150");

      //       // Set app accounts (mock data for now)
      //       setAppAccounts(mockAppAccounts);
      //     }
      // }
    }
    // setIsLoading(false);
  };

  useEffect(() => {
    if (initState == appState.init_success) {
      setIsConnecting(false);
      getUserInfo();
    }
  }, [initState]);

  const AccountInfoView = () => (
    <div className={styles.accountInfoView}>
      {/* 账户卡 */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("account.details", "账户详情")}</h2>
        </div>
        <div className={styles.accountDetails}>
          <div className={styles.accountAvatar}>
            {accountName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="mr-5 text-lg font-medium">{accountName}</div>
            <div className="text-sm font-medium">
              {accountAddress && accountAddress.length > 16
                ? `${accountAddress.substring(
                    0,
                    8
                  )}...${accountAddress.substring(accountAddress.length - 8)}`
                : accountAddress}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(accountAddress || "");
                  window.showToast({
                    content: t("common.copied", "已复制"),
                    position: "bottom",
                  });
                }}
              >
                <Copy className="w-4 h-4 ml-2 text-blue-600" />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.changePasswordWrapper}>
          <button
            className={styles.changePasswordButton}
            onClick={() => router.push("/changePassword")}
          >
            <RightOutline />
            <span className={styles.changePasswordText}>修改密码</span>
          </button>
        </div>
      </div>

      {/* 余额展示 */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceLabel}>US$</div>
        <div className={styles.balance}>
          <span className={styles.balanceAmount}>0.00</span>
          <span className={styles.currencySymbol}>USD</span>
        </div>
        <div className={styles.balanceChange}>+US$0.00 (+0.00%)</div>
      </div>

      {/* 功能按钮区域 */}
      <div className={styles.btns}>
        <div className={styles.btnD}>
          <div className={styles.btn}>
            <SendOutline />
          </div>
          <div className={styles.txt}>买入</div>
        </div>
        <div className={styles.btnD}>
          <div className={styles.btn}>
            <AddOutline />
          </div>
          <div className={styles.txt}>兑换</div>
        </div>
        <div className={styles.btnD}>
          <div className={styles.btn}>
            <LockOutline />
          </div>
          <div className={styles.txt}>发送</div>
        </div>
        <div className={styles.btnD}>
          <div className={styles.btn}>
            <LeftOutline />
          </div>
          <div className={styles.txt}>收款</div>
        </div>
      </div>

      {/* 代币和收藏品标签页 */}
      <div className={styles.tabSection}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tabItem} ${
              activeTab === "tokens" ? styles.active : ""
            }`}
            onClick={() => {
              console.log("点击代币标签");
              setActiveTab("tokens");
            }}
          >
            代币
          </button>
          <button
            className={`${styles.tabItem} ${
              activeTab === "collections" ? styles.active : ""
            }`}
            onClick={() => {
              console.log("点击收藏标签");
              setActiveTab("collections");
            }}
          >
            收藏品
          </button>
          <button
            className={`${styles.tabItem} ${
              activeTab === "activities" ? styles.active : ""
            }`}
            onClick={() => {
              console.log("点击活动标签");
              setActiveTab("activities");
            }}
          >
            活动
          </button>
        </div>
        {activeTab === "tokens" && (
          <div className={styles.tokensList}>
            {/* 代币列表 */}
            <div className={styles.tokenItem}>
              <div className={styles.tokenIcon}></div>
              <div className={styles.tokenInfo}>
                <div className={styles.tokenName}>Ethereum · 赚取</div>
                <div className={styles.tokenChange}>-1.61%</div>
              </div>
              <div className={styles.tokenValue}>US$0.00</div>
            </div>
            {/* 更多代币项... */}
          </div>
        )}
        {activeTab === "collections" && (
          <div className={styles.collectionsList}>
            {/* 收藏品列表 */}
            {/* 如果没有收藏品，显示空状态提示 */}
            <div className={styles.emptyActivity}>
              Nothing to see yet. Swap your first token today.
            </div>
          </div>
        )}
        {activeTab === "activities" && (
          <div className={styles.activityList}>
            {/* 活动列表 */}
            {/* 如果没有活动记录，显示空状态提示 */}
            <div className={styles.emptyActivity}>
              Nothing to see yet. Swap your first token today.
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div>
      {initState == appState.init_failed ? (
        <div className={styles.note}>
          {t("wallet.initialization_failed", "初始化失败")}
        </div>
      ) : (
        <div>
          {isConnecting ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingText}>
                {t("wallet.connecting", "正在连接...")}
              </div>
            </div>
          ) : (
            <div>
              {/* 使用组件中的 Header */}
              <Header
                changeNetworkSuccess={changeSuccess}
                changeAccountSuccess={changeSuccess}
              />
              <div className={styles.contentPage} style={{ width: "100%" }}>
                <AccountInfoView />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
