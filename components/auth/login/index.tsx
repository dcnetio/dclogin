"use client";
import { useEffect } from "react";
import { initializeDatabase } from "@/helpers/DBHelper";
import { initBaseinfo, initNetworks, initCommChannel } from "@/app/index";
import { store } from "@/lib/store";
import { saveInitState } from "@/lib/slices/appSlice";
import { appState, MsgStatus } from "@/config/constant";
import { useRouter } from "next/navigation";
import NavigationService from "@/lib/navigation";
import { updateAppInfo, updateAuthStep } from "@/lib/slices/authSlice";
import { useTranslation } from "next-i18next";
import { dcConfig } from "@/config/define";
import { checkDCInitialized, initDC } from "./dc";
import { container } from "@/server/dc-contianer";

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
      // 保存app信息
      store.dispatch(
        updateAppInfo({
          appId: dcConfig.appInfo?.appId,
          appName: dcConfig.appInfo?.appName,
          appIcon: "",
          appUrl: "",
          appVersion: "",
        })
      );

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
      console.log("debug===========initBaseinfo start", new Date());
      // 调用初始化函数(默认信息)
      await initBaseinfo(); //初始化网络和账号信息
      console.log("debug===========initNetworks start", new Date());
      // 初始化网络数据
      await initNetworks();
      console.log("debug===========initNetworks end", new Date());
      if (!openerOrigin) {
        initServer();
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
      }
    } catch (error) {
      console.error("login error", error);
    } finally {
    }
  };

  const initServer = async () => {
    try {
      // 初始化服务
      const { initializeServices } = await import("../../../server/dc-init");
      const bool = await initializeServices(container);
      if (bool) {
        console.log("✅ 所有服务初始化完成");
      } else {
        console.error("❌ 服务初始化失败");
      }
    } catch (error) {
      console.error("初始化过程出错:", error);
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
