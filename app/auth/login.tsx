"use client";
import { Button, DotLoading, Toast } from "antd-mobile";
import ethers from "@/helpers/ethers";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const router = useRouter();
  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const create = async () => {
    await ethers.createWallet();
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
    // const naccount = "";
    const naccount =
      "about pretty elevator couch keen blood garment bright wagon marble outer around";
    if (naccount) {
      await initWallet(naccount);
    }
    setAccount(naccount);
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
