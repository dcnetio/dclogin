"use client";
import ethers from "@/helpers/ethersHelper";
import styles from "./page.module.css";
import "antd-mobile/es/global";
import { SendOutline, FileOutline } from "antd-mobile-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/common/header";
import { useAppSelector } from "@/lib/hooks";
import { appState, baseUrl } from "@/config/constant";
import { getCurrentAccount, getCurrentNetwork } from "./index";
import { ChainInfo } from "@/types/walletTypes";
import { useTranslation} from 'react-i18next';





export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  console.log("t(transfer)", t('transfer.transfer'));
  const [balance, setBalance] = useState("0");
  const initState = useAppSelector((state) => state.app.initState);
  const [currencySymbol, setCurrencySymbol] = useState("");
  const sendBalance = () => {
    router.push(baseUrl + "/transfer");
  };
  const gotoActivity = () => {
    router.push(baseUrl + "/activity");
  };

  const changeSuccess = async () => {
    // 切换成功后，获取账户，切换余额
    getUserBalance();
  };

  const getUserBalance = async () => {
    const accountInfo = getCurrentAccount();
    console.log("accountInfo1111", accountInfo);
    if (accountInfo && accountInfo.account) {
      const network: ChainInfo | null = getCurrentNetwork();
      if (!network) {
        return;
      }
      setCurrencySymbol(network.currencySymbol);
      const nb = (await ethers.getUserBalance(accountInfo.account)) || "0";
      setBalance(nb);
    }
  };

  useEffect(() => {
    if (initState == appState.init_success) {
      getUserBalance();
    }
  }, [initState]);
  return (
    <div>
      {initState == appState.init_failed ? (
        <div className={styles.note}>空</div>
      ) : (
        <div>
          <Header
            changeNetworkSuccess={changeSuccess}
            changeAccountSuccess={changeSuccess}
          />
          <div className={styles.contentPage}>
            <h1 className={styles.balance}>
              {balance} {currencySymbol}
            </h1>
            <div className={styles.btns}>
              <div className={styles.btnD}>
                <div className={styles.btn} onClick={sendBalance}>
                  <SendOutline fontSize={24} />
                </div>
                <span className={styles.txt}>{t('transfer.transfer')}</span>
              </div>
              <div className={styles.btnD}>
                <div className={styles.btn} onClick={gotoActivity}>
                  <FileOutline fontSize={24} />
                </div>
                <span className={styles.txt}>{t('transfer.activity')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
