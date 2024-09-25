"use client";
import { Button, DotLoading, Toast } from "antd-mobile";
import ethers from "@/helpers/ethers";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveMnemonic } from "@/lib/slices/walletSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { store } from "@/lib/store";

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const mnemonic = useAppSelector(state => state.wallet.mnemonic)
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const create = async () => {
    const wallet = await ethers.createWallet();
    // todo 保存到auth中
    // 保存到store
    store.dispatch(
      saveMnemonic(wallet.mnemonic?.phrase)
    );
    // 提示成功，并跳转到首页
    Toast.show({
      content: "创建成功",
      afterClose: () => {
        router.push("/home");
      },
    });
  };
  const initWallet = async (account: string) => {
    await ethers.createWalletByMnemonic(account);
    // 跳转到首页
    router.push("/home");
  };
  // 获取账号
  const getAccount = async () => {
    if (mnemonic) {
      await initWallet(mnemonic);
    }
    setAccount(mnemonic);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getAccount();
  }, []);

  return (
    <>
      {loading ? (
        <div className={styles.loginPage}>
          <DotLoading color="currentColor" />
        </div>
      ) : (
        !account && (
          <div className={styles.loginPage}>
            <Button color="primary" onClick={create}>
              创建钱包账号
            </Button>
          </div>
        )
      )}
    </>
  );
}
