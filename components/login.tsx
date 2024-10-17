"use client";
import { Dialog, DotLoading, Toast } from "antd-mobile";
import { useEffect, useState } from "react";
import { initializeDatabase } from "@/helpers/DBHelper";
import {
  connectCmdHandler,
  initBaseinfo,
  initNetworks,
  initCommChannel,
} from "@/app/index";
import { store } from "@/lib/store";
import { saveInitState } from "@/lib/slices/appSlice";
import { appState } from "@/context/constant";
import { ConnectReqMessage } from "@/types/walletTypes";

// 获取查询字符串
let queryString = '';
if (typeof window !== 'undefined') {
    queryString = window.location.search;
}
const urlParams = new URLSearchParams(queryString);
const location = urlParams.get("origin");
const openerOrigin = location;

export default function Login() {
  const [loading, setLoading] = useState(true);
  const init = async () => {
    try {
      setLoading(true);
      store.dispatch(saveInitState(appState.initing));
      // 初始化数据库
      const bool = await initializeDatabase();
      if (!bool) {
        store.dispatch(saveInitState(appState.init_failed));
        Toast.show({
          content: "初始化失败，请刷新网页重试",
          position: "bottom",
        });
        return;
      }
      // 调用初始化函数(默认信息)
      await initBaseinfo(); //初始化网络和账号信息
      // 初始化网络数据
      await initNetworks();
      if (typeof window.PublicKeyCredential === "undefined") {  
        console.log("WebAuthn is not supported by this browser."); 
        Dialog.confirm({
          content: 'WebAuth不支持，确认关闭窗口',
          onConfirm: async () => {
            store.dispatch(saveInitState(appState.init_failed));
            window.close();
          },
        })
        return false;  
      }
      //连接网络，并把用户信息保存下来
      const message: ConnectReqMessage = {
        origin: window.location.origin,
      };
      if (!openerOrigin) {
        //改为判断是否有origin参数,如果有则表示是从DAPP打开的
        const accountInfo = await connectCmdHandler(message, false);
        console.log("accountInfo====", accountInfo);
        if(!accountInfo){
          // Toast.show({
          //   content: "连接失败",
          //   position: "bottom",
          // });
          return;
        }
        // 提示成功，并跳转到首页
        Toast.show({
          content: "连接成功",
          position: "bottom",
        });
        // 初始化成功，
        store.dispatch(saveInitState(appState.init_success));
      } else {
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
