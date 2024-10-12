"use client";
import { Button, DotLoading, Toast } from "antd-mobile";
import ethers from "@/helpers/ethersHelper";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { saveAccountInfo } from "@/lib/slices/walletSlice";
import { useAppSelector } from "@/lib/hooks";
import { initializeDatabase } from "@/helpers/DBHelper";
import { connectCmdHandler, initBaseinfo, initNetworks,initCommChannel } from "@/app/home/home";
import { store } from "@/lib/store";
import { saveInitState } from "@/lib/slices/appSlice";
import { appState } from "@/context/constant";


// 获取查询字符串  
const queryString = window.location.search;  
const urlParams = new URLSearchParams(queryString);  
let  location = urlParams.get('origin');
const openerOrigin = location; 

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const init = async () => {
    try {
      setLoading(true);
      store.dispatch(
        saveInitState(appState.initing)
      );
      // 初始化数据库
      const bool = await initializeDatabase();
      if (!bool) {
        store.dispatch(
          saveInitState(appState.init_failed)
        );
        Toast.show({
          content: "初始化失败，请刷新网页重试",
          position: "bottom",
        });
        return;
      }
      // 初始化网络数据
      await initNetworks();
      // 调用初始化函数
      await initBaseinfo(); //初始化网络和账号信息
      //连接网络，并把用户信息保存下来
      const message = {
        origin: window.location.origin,
        data: {
          
        },
      };
      if (!openerOrigin) { //改为判断是否有origin参数,如果有则表示是从DAPP打开的
        const accountInfo = await connectCmdHandler(message, false);
        console.log('accountInfo====', accountInfo)
        store.dispatch(
          saveAccountInfo(accountInfo)
        );
         // 提示成功，并跳转到首页
        Toast.show({
          content: "连接成功",
          position: "bottom",
        });
         // 初始化成功，
        store.dispatch(
          saveInitState(appState.init_success)
        );
      }else{
        initCommChannel();
      }
     
     
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
