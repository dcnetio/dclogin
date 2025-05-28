"use client";
import ethers from "@/helpers/ethersHelper";
import styles from "./page.module.css";
import "antd-mobile/es/global";
import {
  SendOutline,
  FileOutline,
  AddOutline,
  UnorderedListOutline,
  PayCircleOutline,
} from "antd-mobile-icons";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/common/header";
import { useAppSelector } from "@/lib/hooks";
import { appState, baseUrl } from "@/config/constant";
import { getCurrentAccount, getCurrentNetwork } from "@/app/index";
import { ChainInfo } from "@/types/walletTypes";
import { useTranslation } from "react-i18next";

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const initState = useAppSelector((state) => state.app.initState);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [accountName, setAccountName] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [storageSpace, setStorageSpace] = useState("0 GB");
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const sendBalance = () => {
    router.push(baseUrl + "/transfer");
  };

  const gotoActivity = () => {
    router.push(baseUrl + "/activity");
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

  const getUserInfo = async () => {
    setIsLoading(true);
    const accountInfo = getCurrentAccount();
    if (accountInfo && accountInfo.account) {
      setAccountAddress(accountInfo.account);
      setAccountName(accountInfo.name || accountInfo.account.substring(0, 6));

      const network: ChainInfo | null = getCurrentNetwork();
      if (!network) {
        setIsLoading(false);
        return;
      }
      setCurrencySymbol(network.currencySymbol);

      // Simulate getting storage info from the DC API
      if (globalThis.dc && globalThis.dc.auth) {
        try {
          const userInfo = await globalThis.dc.auth.getUserInfoWithAccount(
            "0x" + accountInfo.account
          );
          if (userInfo && userInfo.space) {
            const spaceGB = (userInfo.space / (1024 * 1024 * 1024)).toFixed(2);
            setStorageSpace(`${spaceGB} GB`);
          }
        } catch (error) {
          console.error("Failed to get user storage info", error);
          setStorageSpace("0 GB");
        }
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (initState == appState.init_success) {
      getUserInfo();
    }
  }, [initState]);

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
            {isMobile ? (
              // Mobile Layout
              <>
                {/* 账户信息卡片 */}
                <div className={styles.accountInfoCard}>
                  <div className={styles.accountAvatar}>
                    {accountName.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.accountInfo}>
                    <div className={styles.accountName}>{accountName}</div>
                    <div className={styles.accountAddress}>
                      {accountAddress}
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className={styles.btns}>
                  <div className={styles.btnD}>
                    <div className={styles.btn} onClick={sendBalance}>
                      <SendOutline fontSize={24} />
                    </div>
                    <span className={styles.txt}>
                      {t("transfer.transfer", "转账")}
                    </span>
                  </div>
                  <div className={styles.btnD}>
                    <div className={styles.btn} onClick={gotoActivity}>
                      <FileOutline fontSize={24} />
                    </div>
                    <span className={styles.txt}>
                      {t("transfer.activity", "活动")}
                    </span>
                  </div>
                  <div className={styles.btnD}>
                    <div className={styles.btn} onClick={buyTokens}>
                      <PayCircleOutline fontSize={24} />
                    </div>
                    <span className={styles.txt}>
                      {t("wallet.buy_tokens", "购买代币")}
                    </span>
                  </div>
                </div>

                {/* Storage Section */}
                <div className={styles.storageSection}>
                  <div className={styles.storageHeader}>
                    <div className={styles.storageTitle}>
                      {t("wallet.storage_space", "存储空间")}
                    </div>
                    <div className={styles.upgradeBtn} onClick={upgradeStorage}>
                      {t("wallet.upgrade", "升级")}
                    </div>
                  </div>
                  <div className={styles.storageDetails}>
                    <div className={styles.storageAmount}>{storageSpace}</div>
                    <div className={styles.storageProgress}>
                      <div
                        className={styles.storageProgressBar}
                        style={{ width: "35%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // Desktop Layout (Full Screen)
              <div className={styles.desktopLayout}>
                <div className={styles.desktopSidebar}>
                  <div className={styles.sidebarSection}>
                    <h2 className={styles.sidebarTitle}>
                      {t("wallet.account", "账户")}
                    </h2>
                    <div className={styles.accountCard}>
                      <div className={styles.accountAvatar}>
                        {accountName.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.accountDetails}>
                        <div className={styles.accountName}>{accountName}</div>
                        <div className={styles.accountAddress}>
                          {accountAddress}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.sidebarSection}>
                    <h2 className={styles.sidebarTitle}>
                      {t("wallet.storage", "存储")}
                    </h2>
                    <div className={styles.storageCard}>
                      <div className={styles.storageInfo}>
                        <div className={styles.storageAmount}>
                          {storageSpace}
                        </div>
                        <div className={styles.storageLabel}>
                          {t("wallet.available", "可用")}
                        </div>
                      </div>
                      <div className={styles.storageProgress}>
                        <div
                          className={styles.storageProgressBar}
                          style={{ width: "35%" }}
                        ></div>
                      </div>
                      <button
                        className={styles.upgradeButton}
                        onClick={upgradeStorage}
                      >
                        {t("wallet.upgrade_storage", "升级存储")}
                      </button>
                    </div>
                  </div>

                  <div className={styles.sidebarSection}>
                    <h2 className={styles.sidebarTitle}>
                      {t("wallet.quick_actions", "快速操作")}
                    </h2>
                    <div className={styles.actionsList}>
                      <div className={styles.actionItem} onClick={sendBalance}>
                        <SendOutline className={styles.actionIcon} />
                        <span>{t("transfer.transfer", "转账")}</span>
                      </div>
                      <div className={styles.actionItem} onClick={gotoActivity}>
                        <UnorderedListOutline className={styles.actionIcon} />
                        <span>{t("transfer.activity", "活动")}</span>
                      </div>
                      <div className={styles.actionItem} onClick={buyTokens}>
                        <PayCircleOutline className={styles.actionIcon} />
                        <span>{t("wallet.buy_tokens", "购买代币")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.desktopMain}>
                  {/* 不再显示总余额和最近交易，而是显示欢迎消息和应用介绍 */}
                  <div className={styles.welcomeSection}>
                    <div className={styles.welcomeTitle}>
                      {t("wallet.welcome", `欢迎使用 DCWallet, ${accountName}`)}
                    </div>
                    <div className={styles.welcomeDescription}>
                      {t(
                        "wallet.welcome_description",
                        "您的去中心化数据钱包，安全管理您的数字资产和存储空间"
                      )}
                    </div>
                    
                    <div className={styles.mainActionButtons}>
                      <button
                        className={styles.primaryButton}
                        onClick={sendBalance}
                      >
                        <SendOutline fontSize={18} />
                        {t("transfer.transfer", "转账")}
                      </button>
                      <button className={styles.secondaryButton} onClick={buyTokens}>
                        <AddOutline fontSize={18} />
                        {t("wallet.buy", "购买")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}