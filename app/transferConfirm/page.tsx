"use client";
// import styles from "./page.module.css";
import { useRouter, useSearchParams } from "next/navigation";
import TransItem from "@/components/transfer/transItem";
import { useEffect, useState } from "react";
import { AccountInfo } from "@/types/walletTypes";
import { getCurrentAccount, transfer } from "@/app/index";
import GASItem from "@/components/transfer/gasItem";
import GASTotal from "@/components/transfer/gasTotal";
import { Button, Dialog } from "antd-mobile";
import { appState } from "@/config/constant";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "react-i18next";
import { CheckCircle2 } from "lucide-react";

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
    if (info) {
      setAccountInfo(info);
    }
  };
  const transferBN = async () => {
    if (!amount) {
      window.showToast({
        content: t("transfer.enter_info"),
        position: "center",
      });
      return;
    }
    // 确认框
    Dialog.confirm({
      content: (
        <div className="p-4 text-center">
          <div className="text-lg font-bold mb-2 text-slate-800">
            {t("transfer.confirm_transfer")}
          </div>
          <div className="text-sm text-slate-600 break-all">
            {t("transfer.confirm_to")}{" "}
            <span className="font-mono text-primary">{to}</span> <br />
            {t("transfer.transfer")}{" "}
            <span className="font-bold text-slate-800">
              {amount} {currencySymbol}
            </span>
          </div>
        </div>
      ),
      confirmText: t("common.confirm"),
      cancelText: t("common.cancel"),
      onConfirm: async () => {
        console.log("transferBN");
        // todo 调用js转账，需要auth认证
        const res = await transfer(
          to,
          amount,
          21000, //todo gasLimit:
          "0.5" // todo gasPrice
        ); // gasPrice:
        if (res) {
          window.showToast({
            content: t("transfer.transfer_success"),
            position: "center",
          });
          router.replace("/activity");
        } else {
          window.showToast({
            content: t("transfer.transfer_failed"),
            position: "center",
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl space-y-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          {t("transfer.confirm_title", "确认转账")}
        </h2>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <TransItem fromItem={accountInfo} to={to} />
        </div>

        <div className="text-center py-6 space-y-2">
          <div className="text-sm text-slate-400">
            {t("activity.sending")} {currencySymbol}
          </div>
          <div className="text-4xl font-bold text-white font-mono tracking-tight">
            {amount}{" "}
            <span className="text-lg text-slate-400 font-sans">
              {currencySymbol}
            </span>
          </div>
        </div>

        <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-4">
          <GASItem amount={amount} currencySymbol={currencySymbol} />
          <div className="h-px bg-white/10 my-2"></div>
          <GASTotal amount={amount} currencySymbol={currencySymbol} />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            className="btn-secondary !rounded-xl !h-12 !text-base !font-medium"
            onClick={() => {
              router?.back();
            }}
            block
          >
            {t("common.cancel")}
          </Button>
          <Button
            className="btn-primary !rounded-xl !h-12 !text-base !font-semibold"
            onClick={transferBN}
            block
          >
            {t("common.confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}
