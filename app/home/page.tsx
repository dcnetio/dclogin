"use client";
import styles from "./page.module.css";
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
// Mock app accounts data
// const mockAppAccounts = [
//   { appName: "DeCert", appId: "decert-123", appAccount: "0x8721...3d91", appDomain: "decert.network" },
//   { appName: "DataVault", appId: "datavault-456", appAccount: "0x6532...7e22", appDomain: "datavault.io" },
//   { appName: "FileShare", appId: "fileshare-789", appAccount: "0x3251...9f43", appDomain: "fileshare.app" },
// ];

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
  // const [appAccounts, setAppAccounts] = useState(mockAppAccounts);


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
      getUserInfo();
    }
  }, []);

  // Account Info View Component
  const AccountInfoView = () => (
    <div className={styles.accountInfoView}>
      {/* Account Card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("account.details", "账户详情")}</h2>
        </div>
        <div className={styles.accountDetails}>
          <div className={styles.accountAvatar}>
            {accountName.charAt(0).toUpperCase()}
          </div>
          <div className={styles.accountInfo}>
            <div className={styles.accountName}>{accountName}</div>
            <div className={styles.accountAddress}>{accountAddress}</div>
          </div>
        </div>
      </div>

      {/* Storage Space Card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("storage.title", "云存储空间")}</h2>
          <button className={styles.actionButton} onClick={upgradeStorage}>
            {t("storage.upgrade", "升级")}
          </button>
        </div>
        <div className={styles.storageDetails}>
          <div className={styles.storageInfo}>
            {/* <div className={styles.storageValue}>
              <span className={styles.usedStorage}>{usedStorageSpace}</span>
              <span className={styles.totalStorage}>/ {storageSpace}</span>
            </div> */}
            <div className={styles.storageLabel}>
              {t("storage.used", "已使用")}
            </div>
          </div>
          <div className={styles.storageProgress}>
            {/* <div
              className={styles.storageProgressBar}
              style={{ width: `${storagePercentage}%` }}
            ></div> */}
          </div>
        </div>
      </div>

      {/* Token Card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("tokens.title", "云服务代币")}</h2>
          <button className={styles.actionButton} onClick={buyTokens}>
            {t("tokens.buy", "购买")}
          </button>
        </div>
        <div className={styles.tokenDetails}>
          {/* <div className={styles.tokenAmount}>{tokenAmount}</div> */}
          <div className={styles.tokenLabel}>
            {t("tokens.available", "可用代币")}
          </div>
          <div className={styles.tokenDescription}>
            {t("tokens.description", "代币可用于升级存储空间和购买高级服务")}
          </div>
        </div>
      </div>

      {/* App Accounts Card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("appAccounts.title", "应用账号")}</h2>
        </div>
        {/* <div className={styles.appAccountsList}>
          {appAccounts.length > 0 ? (
            appAccounts.map((app, index) => (
              <div key={index} className={styles.appAccountItem}>
                <div className={styles.appIcon}>
                  <AppstoreOutline />
                </div>
                <div className={styles.appDetails}>
                  <div className={styles.appName}>{app.appName}</div>
                  <div className={styles.appAccount}>{app.appAccount}</div>
                  <div className={styles.appMeta}>
                    <span className={styles.appId}>{app.appId}</span>
                    <span className={styles.appDomain}>{app.appDomain}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              {t("appAccounts.empty", "暂无应用账号")}
            </div>
          )}
        </div> */}
      </div>

      {/* Wallet Entry Button */}
      <button className={styles.walletEntryButton} onClick={goToWallet}>
        <LockOutline className={styles.walletEntryIcon} />
        <span>{t("wallet.enter", "进入加密钱包")}</span>
        <RightOutline />
      </button>
    </div>
  );

  // Wallet View Component
  const WalletView = () => (
    <div className={styles.walletView}>
      {/* Back button to return to account view */}
      <button className={styles.backButton} onClick={goToAccount}>
        <LeftOutline />
        <span>{t("wallet.back_to_account", "返回账户")}</span>
      </button>

      {/* Wallet Balance Card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("wallet.balance", "钱包余额")}</h2>
        </div>
        <div className={styles.balanceDetails}>
          <div className={styles.balanceLabel}>
            {t("wallet.current_balance", "当前余额")}
          </div>
          <div className={styles.balance}>
            <span className={styles.balanceAmount}>0.0</span>
            <span className={styles.currencySymbol}>{currencySymbol}</span>
          </div>
          <div className={styles.walletActions}>
            <button className={styles.primaryButton} onClick={sendBalance}>
              <SendOutline />
              {t("transfer.transfer", "转账")}
            </button>
            <button className={styles.secondaryButton} onClick={buyTokens}>
              <AddOutline />
              {t("wallet.buy", "购买")}
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History Card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("wallet.transactions", "交易记录")}</h2>
          <button className={styles.actionButton} onClick={gotoActivity}>
            {t("wallet.view_all", "查看全部")}
          </button>
        </div>
        <div className={styles.transactionsList}>
          <div className={styles.emptyState}>
            {t("wallet.no_transactions", "暂无交易记录")}
          </div>
        </div>
      </div>

      {/* Wallet Accounts Card */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>{t("wallet.accounts", "钱包账户")}</h2>
        </div>
        <div className={styles.walletAccountsList}>
          <div className={styles.walletAccountItem}>
            <div className={styles.accountAvatar}>
              {accountName.charAt(0).toUpperCase()}
            </div>
            <div className={styles.accountInfo}>
              <div className={styles.accountName}>{accountName}</div>
              <div className={styles.accountAddress}>{accountAddress}</div>
            </div>
            <div className={styles.accountIndicator}>
              <span className={styles.currentIndicator}>
                {t("wallet.current", "当前")}
              </span>
            </div>
          </div>
        </div>
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
        <>
          <Header
            changeNetworkSuccess={changeSuccess}
            changeAccountSuccess={changeSuccess}
          />

          <div className={styles.contentPage}>
            {activeView === "account" ? <AccountInfoView /> : <WalletView />}
          </div>
        </>
      )}
    </div>
  );
}