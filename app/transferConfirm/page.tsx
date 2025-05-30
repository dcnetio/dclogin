"use client";
import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import TransItem from "@/components/transfer/transItem";
import { useEffect, useState } from "react";
import { AccountInfo } from "@/types/walletTypes";
import { getCurrentAccount, transfer } from "@/app/index";
import GASItem from '@/components/transfer/gasItem'
import GASTotal from '@/components/transfer/gasTotal'
import { Button, Dialog } from "antd-mobile";
import { appState } from "@/config/constant";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "react-i18next";
export default function TransferConfirm() {
  const router = useRouter();
  const { t } = useTranslation();
  const initState = useAppSelector((state) => state.app.initState);
  const searchParams = useSearchParams();
  const to = searchParams.get("to") || "";
  const amount = searchParams.get("amount") || "";
  const currencySymbol = searchParams.get("currencySymbol") || "";
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const getUserBalance = async () => {
    const info = getCurrentAccount();
    console.log("getCurrentAccount info", info);
    if (info) {
      setAccountInfo(info);
    }
  };
  const transferBN = async () => {
    if (!amount) {
      window.showToast({
        content: t('transfer.enter_info'),
        position: "bottom",
      });
      return;
    }
    // 确认框
    Dialog.confirm({
      content: (
        <div className={styles.pop}>
          <div className={styles.sTitle}>{t('transfer.confirm_transfer')}：</div>
          <div className={styles.address}>{t('transfer.confirm_to')} {to} {t('transfer.transfer')} {amount} {currencySymbol}</div>
        </div>
      ),
      confirmText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onConfirm: async () => {
        console.log("transferBN");
        // todo 调用js转账，需要auth认证
        const res = await transfer(
          to,
          amount,
          21000, //todo gasLimit:
          '0.5' // todo gasPrice
        ); // gasPrice:
        if (res) {
          window.showToast({
            content: t('transfer.transfer_success'),
            position: "bottom",
          });
          router.replace('/activity');
        } else {
          window.showToast({
            content: t('transfer.transfer_failed'),
            position: "bottom",
          });
        }
      },
    });
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
    <div>
      <TransItem fromItem={accountInfo} to={to} />
      <div className={styles.content}>
        <div className={styles.balanceD}>
          <div className={styles.tag}>
            {t('activity.sending')}{currencySymbol}
          </div>
          <div className={styles.balance}>{amount} {currencySymbol}</div>
        </div>
        <GASItem amount={amount} currencySymbol={currencySymbol}/>
        <GASTotal amount={amount} currencySymbol={currencySymbol}/>
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
          <Button color="primary" fill="solid" onClick={transferBN} block>
            {t('common.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
