"use client";
import { Button, DotLoading, Toast } from "antd-mobile";
import ethers from "@/helpers/ethersHelper";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveAccountInfo } from "@/lib/slices/walletSlice";
import { useAppSelector } from "@/lib/hooks";
import { initializeDatabase } from "@/helpers/DBHelper";
import { connectCmdHandler, initBaseinfo, initNetworks } from "@/app/home/home";
import { store } from "@/lib/store";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const init = async () => {
    try {
      setLoading(true);
      // 初始化数据库
      const bool = await initializeDatabase();
      // 初始化网络数据
      await initNetworks();
      // 调用初始化函数
      await initBaseinfo(); //初始化网络和账号信息
      if (!bool) {
        Toast.show({
          content: "初始化失败，请刷新网页重试",
          position: "bottom",
        });
        return;
      }
      // 初始化成功，连接网络，并把用户信息保存下来
      const message = {
        data: {
          origin: window.location.origin,
        },
      };
      const accountInfo = await connectCmdHandler(message, false);
      store.dispatch(
        saveAccountInfo(accountInfo)
      );
      // 提示成功，并跳转到首页
      Toast.show({
        content: "连接成功",
        position: "bottom",
        afterClose: () => {
          router.push("/home");
        },
      });
    } catch (error) {
      console.error("login error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("===============login");
    init();
  }, []);

  return (
    <>
      {loading && (
        // <div className={styles.loginPage}></div>
        <DotLoading color="currentColor" />
        // </div>
      )}
    </>
  );
}
