"use client";
import { Button, DotLoading, Toast } from "antd-mobile";
import ethers from "@/helpers/ethersHelper";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveAccount } from "@/lib/slices/walletSlice";
import { useAppSelector } from "@/lib/hooks";
import { store } from "@/lib/store";

export default function Login() {
  const router = useRouter();
  const accountInfo = useAppSelector(state => state.wallet.account)
  const [loading, setLoading] = useState(true);
  const create = async () => {
    // todo 后期改成从js获取（需要auth认证）
    // const wallet = await ethers.createWallet();
    // 保存到store
    // store.dispatch(
    //   saveAccount({
    //     name: 'Account' + 1, // todo 暂时定1，后期根据account个数调整
    //     address: wallet.address
    //   })
    // );
    // 提示成功，并跳转到首页
    Toast.show({
      content: "创建成功",
      position: "bottom",
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
    if (accountInfo) {
      // todo后期改成js获取（auth认证）
      await create();
      // await initWallet(accountInfo.address);
    }else {
      await create();
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log("===============login");
    setLoading(true);
    getAccount();
  }, []);

  return (
    <>
      {loading && (
        <div className={styles.loginPage}>
          <DotLoading color="currentColor" />
        </div>
      )}
    </>
  );
}
