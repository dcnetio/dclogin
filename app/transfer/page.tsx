"use client";
import { Button, Input } from "antd-mobile";
// import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { AccountInfo, ChainInfo } from "@/types/walletTypes";
import ethers from "@/helpers/ethersHelper";
import { getCurrentNetwork } from "@/app/index";
import { useRouter } from "next/navigation";
import TransAccount from "@/components/transfer/transAccount";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

export default function Transfer() {
  const router = useRouter();
  const { t } = useTranslation();
  const [address, setAddress] = useState("");
  const [accountInfo, setAccountInfo] = useState<AccountInfo>();
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");

  const account: AccountInfo = useAppSelector((state) => state.wallet.account);

  const gotoConfirm = () => {
    if (!balance || !amount) {
      window.showToast({
        content: t("transfer.enter_info"),
        position: "center",
      });
      return;
    }
    router.replace(
      `/transferConfirm?to=${address}&amount=${amount}&currencySymbol=${currencySymbol}`
    );
  };
  const getUserBalance = async () => {
    const network: ChainInfo | null = getCurrentNetwork();
    if (!network) {
      return;
    }
    setCurrencySymbol(network.currencySymbol);
    const nb = (await ethers.getUserBalance(account?.account || "")) || "0";
    setBalance(nb);
  };

  useEffect(() => {
    getUserBalance();
  }, []);
  useEffect(() => {
    if (account && account.nftAccount) {
      setAccountInfo(account);
      getUserBalance();
    }
  }, [account?.nftAccount]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl space-y-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          {t("transfer.title", "转账")}
        </h2>

        <div className="space-y-2">
          <p className="text-sm text-slate-400 ml-1">{t("common.from")}</p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <TransAccount
              accountInfo={accountInfo}
              balance={balance}
              currencySymbol={currencySymbol}
            />
          </div>
        </div>

        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-slate-800 border border-white/10 rounded-full p-2 text-slate-400">
            <ArrowRight size={20} className="rotate-90" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-slate-400 ml-1">{t("common.to")}</p>
            <Input
              placeholder={t("transfer.enter_address")}
              value={address}
              onChange={setAddress}
              onEnterPress={gotoConfirm}
              clearable
              className="input-tech !bg-slate-800/50 !border-slate-700 focus:!border-primary"
              style={{ '--font-size': '16px' }}
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-400 ml-1">{t("transfer.amount", "金额")}</p>
            <div className="relative">
              <Input
                placeholder={t("transfer.enter_number")}
                value={amount}
                onChange={setAmount}
                onEnterPress={gotoConfirm}
                clearable
                className="input-tech !bg-slate-800/50 !border-slate-700 focus:!border-primary pr-16"
                style={{ '--font-size': '16px' }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                {currencySymbol}
              </div>
            </div>
          </div>
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
            onClick={gotoConfirm} 
            block
          >
            {t("common.continue")}
          </Button>
        </div>
      </div>
    </div>
  );
}
