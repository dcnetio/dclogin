"use client";
import { Button, Input, Toast } from "antd-mobile";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { AccountInfo, ChainInfo } from "@/types/walletTypes";
import ethers from "@/helpers/ethersHelper";
import { getCurrentAccount, getCurrentNetwork } from "@/app/index";
import { useRouter } from "next/navigation";
import TransAccount from "@/components/transfer/transAccount";
import { appState, baseUrl } from "@/config/constant";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation} from 'react-i18next';
export default function Transfer() {
  const router = useRouter();
  const {t} = useTranslation();
  const [address, setAddress] = useState("");
  const initState = useAppSelector((state) => state.app.initState);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const gotoConfirm = () => {
    if (!balance || !amount) {
      Toast.show({
        content: t('transfer.enter_info'),
        position: "bottom",
      });
      return;
    }
    router.replace(`${baseUrl}/transferConfirm?to=${address}&amount=${amount}&currencySymbol=${currencySymbol}`);
  };
  const getUserBalance = async () => {
    const info = getCurrentAccount();
    console.log("getCurrentAccount info", info);
    if (info) {
      setAccountInfo(info);
      const network: ChainInfo | null = getCurrentNetwork();
      if (!network) {
        return;
      }
      setCurrencySymbol(network.currencySymbol);
      const nb =
        (await ethers.getUserBalance(info?.account || "")) || "0";
      setBalance(nb);
    }
  };

  useEffect(() => {
    getUserBalance();
  }, []);
  useEffect(() => {
    if (initState == appState.init_success) {
      getUserBalance();
    }
  }, [initState]);
  return (
    <div className={styles.content}>
      <p>{t('common.from')}</p>
      <TransAccount accountInfo={accountInfo} balance={balance} currencySymbol={currencySymbol}/>
      <p>{t('common.to')}</p>
      <div className={styles.input}>
        <Input
          placeholder={t('transfer.enter_address')}
          value={address}
          onChange={setAddress}
          onEnterPress={gotoConfirm}
          clearable
        />
      </div>
      <div className={styles.input}>
        <Input
          placeholder={t('transfer.enter_number') + currencySymbol}
          value={amount}
          onChange={setAmount}
          onEnterPress={gotoConfirm}
          clearable
        />
      </div>
      <div className={styles.btnD}>
        <div className={styles.btn}>
          <Button
            color="primary"
            fill="outline"
            onClick={() => {
              router?.back();
            }}
            block
          >
            {t('common.cancel')}
          </Button>
        </div>
        <div className={styles.btn}>
          <Button color="primary" fill="solid" onClick={gotoConfirm} block>
          {t('common.continue')}
          </Button>
        </div>
      </div>
    </div>
  );
}
