"use client";
import { useEffect } from "react";
import { initializeDatabase } from "@/helpers/DBHelper";
import {
  connectCmdHandler,
  initBaseinfo,
  initNetworks,
  initCommChannel,
} from "@/app/index";
import { store } from "@/lib/store";
import { saveInitState } from "@/lib/slices/appSlice";
import { appState, MsgStatus } from "@/config/constant";
import { useRouter } from "next/navigation";
import NavigationService from "@/lib/navigation";
import { updateAppInfo, updateAuthStep } from "@/lib/slices/authSlice";
import { useTranslation } from "next-i18next";
import { dcConfig } from "@/config/define";
import { ConnectReqMessage } from "@/types/walletTypes";
import { checkDCInitialized, initDC } from "./dc";

// 获取查询字符串
let queryString = "";
if (typeof window !== "undefined") {
  queryString = window.location.search;
}
const urlParams = new URLSearchParams(queryString);
const location = urlParams.get("origin");
const openerOrigin = location;

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const init = async () => {
    try {
      if (openerOrigin) {
        // dapp打开钱包，立刻回复钱包已经加载
        initCommChannel();
      }

      store.dispatch(saveInitState(appState.initing));
      // 授权开始
      store.dispatch(
        updateAuthStep({
          type: MsgStatus.failed,
          content: t("auth.begin"),
        })
      );

      // 初始化数据库
      const bool = await initializeDatabase();
      if (!bool) {
        store.dispatch(saveInitState(appState.init_failed));
        store.dispatch(
          updateAuthStep({
            type: MsgStatus.failed,
            content: t("auth.failed"),
          })
        );
        return;
      }
      store.dispatch(
        updateAppInfo({
          appId: "",
          appName: "",
          appIcon: "",
          appUrl: "",
          appVersion: "",
        })
      );
      console.log("debug===========initBaseinfo start", new Date());
      // 调用初始化函数(默认信息)
      await initBaseinfo(); //初始化网络和账号信息
      console.log("debug===========initNetworks start", new Date());
      // 初始化网络数据
      await initNetworks();
      console.log("debug===========initNetworks end", new Date());
      //连接网络，并把用户信息保存下来
      const message: ConnectReqMessage = {
        origin: window.location.origin,
      };
      if (!openerOrigin) {
        // 循环判断dc是否存在，并设置超时，超过3s则直接返回
        const dc = await checkDCInitialized();
        if (!dc) {
          store.dispatch(
            updateAuthStep({
              type: MsgStatus.failed,
              content: t("dc.failed"),
            })
          );
          return;
        }
        // 判断如果是login，register，则跳过
        if (
          window.location.pathname.indexOf("login") > -1 ||
          window.location.pathname.indexOf("register") > -1
        ) {
          return;
        }
        //改为判断是否有origin参数,如果有则表示是从DAPP打开的
        const accountInfo = await connectCmdHandler(message, false);
        console.log("accountInfo====", accountInfo);
        if (!accountInfo) {
          return;
        }
        // 提示成功，并跳转到首页
        store.dispatch(
          updateAuthStep({
            type: MsgStatus.failed,
            content: t("auth.success"),
          })
        );
        // 初始化成功，
        store.dispatch(saveInitState(appState.init_success));
        if (
          window.location.pathname.indexOf("login") > -1 ||
          window.location.pathname.indexOf("register") > -1
        ) {
          router.replace(`/${window.location.search}`);
          return;
        }
        router.refresh();
      }
    } catch (error) {
      console.error("login error", error);
    } finally {
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (
        window.location.href.indexOf("/test") == -1 &&
        window.location.href.indexOf("/iframe") == -1
      ) {
        initDC(dcConfig);
        init();
      }
    }
  }, []);

  useEffect(() => {
    console.log("debug===========NavigationService init", new Date());
    NavigationService.init(router);
  }, [router]);
  return <></>;
}
