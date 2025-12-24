"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Header from "@/components/common/header";
import StorageSubscriptionModal from "@/components/modals/StorageSubscriptionModal";
import AccountSwitchModal from "@/components/modals/AccountSwitchModal";
import { useAppSelector } from "@/lib/hooks";
import {
  getUserInfoWithNft,
  getAllAccounts,
  chooseStoredAccount,
  login,
} from "@/services/account";
import { User } from "web-dc-api";
import { Toast } from "antd-mobile";
import ethers from "@/helpers/ethersHelper";
import {
  asyncAuthRecord,
  getAuthRecordsWithAccount,
} from "@/services/threadDB/auths";
import { AuthRecord } from "@/types/pageType";
import { AccountInfo } from "@/types/walletTypes";
import { useRouter, useSearchParams } from "next/navigation";
import DAPPNote from "@/components/note/DAPPNote";
import dayjs from "dayjs";
import { store } from "@/lib/store";
import { updateAuthStep } from "@/lib/slices/authSlice";
import { saveInitState } from "@/lib/slices/appSlice";
import { saveAccountInfo } from "@/lib/slices/walletSlice";
import { MsgStatus, appState } from "@/config/constant";
import { useTranslation } from "react-i18next";
import { showEncodePassword } from "@/components/note/noteHelper";
import { ArrowLeft } from "lucide-react";

interface UserInfo extends User {
  points: number;
  cloudServiceToken: number;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const authInfo = useAppSelector((state) => state.auth.authInfo);
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [apps] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<AuthRecord[]>([]);
  const [displayedLoginHistory, setDisplayedLoginHistory] = useState<
    AuthRecord[]
  >([]);
  const [error] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  // const [setShowExchangeModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const account: AccountInfo = useAppSelector((state) => state.wallet.account);

  const HISTORY_PAGE_SIZE = 3;

  const calculateMaintainableDate = () => {
    if (!userInfo?.cloudServiceToken || !userInfo?.subscribeSpace) return "-";
    const spaceInGB = userInfo.subscribeSpace / (1024 * 1024 * 1024);
    if (spaceInGB === 0) return "-";
    const dailyCost = spaceInGB * 15;
    const days = Math.floor(userInfo.cloudServiceToken / dailyCost);
    const expireDate = dayjs().add(days, "day").format("YYYY-MM-DD");
    return expireDate;
  };

  const gotoTokenUsage = () => {
    router.push("/token-usage");
  };

  // 获取用户信息的逻辑
  const getUserInfo = async () => {
    // setIsLoading(true);
    // 获取用户信息
    const [userInfo, error] = await getUserInfoWithNft(account.nftAccount);
    if (error) {
      Toast.show({
        content: error.message || t("home.get_user_info_failed"),
        position: "center",
      });
      return;
    }
    // 获取用户余额
    const balance = await ethers.getUserBalance(account.account);
    userInfo.points = balance;

    // 获取当前区块高度
    const blockHeight = await ethers.getBlockNumber();
    // 计算云服务Token
    // 算法: (过期区块高度 - 缓冲区块数 - 当前区块高度) * 订阅空间(GB) / 1000
    // 缓冲区块数 = 10 * 60 * 24 * 30 = 432000
    const expireDeleteNumber = userInfo.expireNumber || 0;
    const subscribeSpace = userInfo.subscribeSpace || 0;
    const height = expireDeleteNumber - 432000 - blockHeight;
    const token = height
      ? (Number(height) * Number(subscribeSpace)) / 1024 / 1024 / 1024 / 1000
      : 0;

    userInfo.cloudServiceToken = token > 0 ? Math.floor(token) : 0;

    setUserInfo(userInfo);
    // 获取授权记录
    getAuthHistorys(account.account);
  };

  const getAuthHistorys = async (accountStr: string): Promise<AuthRecord[]> => {
    try {
      console.log("getAuthHistorys accountStr", accountStr);
      const records = await getAuthRecordsWithAccount(accountStr);
      setLoginHistory(records);
      // 同步授权记录
      const flag = await asyncAuthRecord(accountStr);
      if (flag) {
        const nrecords = await getAuthRecordsWithAccount(accountStr);
        setLoginHistory(nrecords);
      }
    } catch (error) {
      console.log("getAuthHistorys error", error);
      Toast.show({
        content: error.message || t("home.get_auth_history_failed"),
        position: "center",
      });
      return [];
    }
  };

  const handleLoadMoreHistory = () => {
    setHistoryPage((prevPage) => prevPage + 1);
  };

  const handleSubscribeStorage = () => {
    setShowStorageModal(true);
  };

  // const handleExchangePoints = async (points: number) => {
  //   try {
  //     const dc = await getDC();
  //     if (!dc) {
  //       throw new Error("未获取到有效的 DC 实例");
  //     }

  //     let [kvdb] = await dc.keyValue.getStore(
  //       dc.appInfo.appId,
  //       "keyvalue_user_pub",
  //       APPThemeConfig.appThemeAuthor
  //     );
  //     if (!kvdb) {
  //       throw new Error("用户主题不存在");
  //     }

  //     alert(`成功兑换 ${points} 积分`);
  //   } catch (err) {
  //     setError(err.message || "兑换失败");
  //   }
  // };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const formatTokenCount = (count: number) => {
    if (!count) return "0";
    if (count < 10000) return count.toString();
    if (count < 100000000)
      return (count / 10000).toFixed(2) + t("home.ten_thousand");
    if (count < 1000000000000)
      return (count / 100000000).toFixed(2) + t("home.hundred_million");
    return (count / 1000000000000).toFixed(2) + t("home.trillion");
  };

  const handleRefreshLoginHistory = async () => {
    if (account && account.account) {
      const accountStr = account.account;
      // 同步授权记录
      const flag = await asyncAuthRecord(accountStr);
      if (flag) {
        const nrecords = await getAuthRecordsWithAccount(accountStr);
        setLoginHistory(nrecords);
      }
    }
  };

  const gotoOrderRecords = () => {
    router.push("/orders");
  };

  const exchangePoints = async () => {
    if (!userInfo) {
      Toast.show({
        content: t("home.not_logged_in"),
        position: "center",
      });
      return;
    }
    if (!userInfo?.points || userInfo.points == 0) {
      // Optionally show a message or handle the case when points are insufficient
      Toast.show({
        content: t("home.insufficient_points"),
        position: "center",
      });
      return;
    }
    // setShowExchangeModal(true);
  };

  useEffect(() => {
    if (account && account.nftAccount) {
      getUserInfo();
    }
  }, [account?.nftAccount]);

  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    // 当历史记录或页码变化时，更新显示的记录
    const startIndex = 0;
    const endIndex = historyPage * HISTORY_PAGE_SIZE;
    setDisplayedLoginHistory(loginHistory.slice(startIndex, endIndex) || []);
  }, [loginHistory, historyPage]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollWidth <= container.clientWidth) return;
      const width = container.clientWidth;
      const newIndex = Math.round(container.scrollLeft / width);
      setActiveCardIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const interval = setInterval(() => {
      // Only scroll if overflow exists (mobile)
      if (container.scrollWidth <= container.clientWidth) return;

      const width = container.clientWidth;
      const currentScroll = container.scrollLeft;
      const currentIndex = Math.round(currentScroll / width);
      const nextIndex = (currentIndex + 1) % 3;

      container.scrollTo({
        left: nextIndex * width,
        behavior: "smooth",
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      // 登录逻辑
      const [user, error] = await login();
      if (error) {
        // 提示失败
        Toast.show({
          content: t("login.failed"),
          position: "center",
        });
        return;
      }
      if (!user) {
        if (authInfo.needLogin) {
          // 未登录过，前往登录页
          router.replace(`/login`);
        }
        return;
      }
      // 提示成功，并跳转到首页
      store.dispatch(
        updateAuthStep({
          type: MsgStatus.success,
          content: t("auth.success"),
        })
      );
      // 初始化成功，
      store.dispatch(saveInitState(appState.init_success));
      router.replace(
        `/${
          window.location.pathname && window.location.pathname.startsWith("/")
            ? window.location.pathname.slice(1)
            : window.location.pathname
        }${window.location.search}`
      );
    } catch (err) {
      console.error("登录失败:", err);
    }
  }, [authInfo, router, t]);

  const renderAppsSection = () => (
    <div className="glass-panel p-6 rounded-2xl text-left">
      <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-green-500 rounded-full"></span>
        {t("home.recommended_apps")}
      </h3>
      {apps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <div
              key={app.id}
              className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 flex items-center transition-all hover:scale-[1.02] cursor-pointer"
            >
              <img
                src={
                  app.iconUrl ||
                  "https://images.unsplash.com/photo-1637593992672-ed85a851fdc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                }
                alt={app.name}
                className="w-12 h-12 rounded-xl mr-4 object-cover shadow-lg"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1637593992672-ed85a851fdc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80";
                }}
              />
              <div>
                <h4 className="font-medium text-white">{app.name}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {app.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-500">
          <p>{t("home.reviewing")}</p>
        </div>
      )}
    </div>
  );

  if (!!origin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <DAPPNote />
      </div>
    );
  }

  // 未登录状态显示欢迎页面
  if (!account || !account.nftAccount) {
    return (
      <div className="min-h-screen relative bg-[#0B0E14] overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute top-4 left-4 z-50 hidden md:block">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all text-white"
          >
            <ArrowLeft size={20} />
            <span>{t("home.back_to_home")}</span>
          </button>
        </div>
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/10 blur-[120px] animate-pulse" />
          <div
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-secondary/10 blur-[120px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-4xl w-full relative z-10">
          <div className="text-center space-y-8">
            {/* Logo 和标题 */}
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <img
                    src="/logo.svg"
                    alt="DCLogin Logo"
                    className="relative w-24 h-24 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 tracking-tight pb-2">
                  DCLogin
                </h1>
                <p className="text-xl md:text-2xl text-blue-100/80 font-light">
                  {t("home.subtitle")}
                </p>
              </div>
            </div>

            {/* 功能卡片 */}
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex md:grid md:grid-cols-3 gap-0 md:gap-4 mt-12 mb-8 md:mb-12 overflow-x-auto md:overflow-visible pb-0 md:pb-0 snap-x snap-mandatory scroll-smooth no-scrollbar"
              >
                <div className="min-w-full md:min-w-0 flex-shrink-0 snap-center glass-panel p-6 rounded-2xl border border-white/10 hover:border-primary/30 transition-all hover:scale-105">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t("home.secure_private")}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {t("home.secure_private_desc")}
                  </p>
                </div>

                <div className="min-w-full md:min-w-0 flex-shrink-0 snap-center glass-panel p-6 rounded-2xl border border-white/10 hover:border-secondary/30 transition-all hover:scale-105">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-6 h-6 text-secondary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t("home.unified_login")}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {t("home.unified_login_desc")}
                  </p>
                </div>

                <div className="min-w-full md:min-w-0 flex-shrink-0 snap-center glass-panel p-6 rounded-2xl border border-white/10 hover:border-accent/30 transition-all hover:scale-105">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                    <svg
                      className="w-6 h-6 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {t("home.decentralized")}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {t("home.decentralized_desc")}
                  </p>
                </div>
              </div>

              {/* Dots - Mobile only */}
              <div className="flex justify-center gap-2 md:hidden mb-12">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeCardIndex ? "bg-white w-6" : "bg-white/20 w-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* 登录按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <button
                onClick={handleLogin}
                className="group relative px-8 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-semibold text-lg shadow-lg hover:shadow-primary/50 transition-all hover:scale-105 min-w-[200px]"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  {t("home.login")}
                </span>
              </button>

              <button
                onClick={() => router.push("/register")}
                className="px-8 py-4 glass-panel rounded-xl text-white font-semibold text-lg border border-white/20 hover:border-white/40 transition-all hover:scale-105 min-w-[200px]"
              >
                {t("home.register")}
              </button>
            </div>

            {/* 底部说明 */}
            <div className="mt-12 text-center">
              <p className="text-sm text-slate-400">{t("home.footer_desc")}</p>
            </div>
          </div>
        </div>
        <AccountSwitchModal
          isOpen={showAccountModal}
          onClose={() => setShowAccountModal(false)}
        />
      </div>
    );
  }

  if (error && !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-panel p-6 max-w-md w-full rounded-2xl border-red-500/30">
          <h2 className="text-xl font-bold text-red-400 mb-4">
            {t("home.error")}
          </h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            className="btn-primary w-full"
            onClick={() => window.location.reload()}
          >
            {t("home.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white pb-20">
      {/* 顶部用户信息栏 */}
      <Header />

      <div className="app-container py-8 space-y-8">
        {/* 账户概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 存储使用情况 */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-visible group hover:border-primary/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                {t("home.my_space")}
              </h3>
              <div className="bg-primary/20 p-2 rounded-xl text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 7v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm text-slate-400">
                <span>
                  {t("home.used")}:{" "}
                  <span className="text-white font-mono">
                    {formatBytes(userInfo?.usedSpace || 0)}
                  </span>
                </span>
                <span>
                  {t("home.total")}:{" "}
                  <span className="text-white font-mono">
                    {formatBytes(userInfo?.subscribeSpace || 0)}
                  </span>
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-primary to-cyan-400 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-500"
                  style={{
                    width: `${
                      ((userInfo?.usedSpace ? userInfo?.usedSpace : 0) /
                        (userInfo?.subscribeSpace || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5">
                <div
                  className="flex items-center gap-2 mb-2 relative cursor-pointer group/token"
                  onClick={gotoTokenUsage}
                >
                  <span className="text-slate-400 text-sm group-hover/token:text-white transition-colors">
                    {t("home.available_token")}:
                  </span>
                  <span className="text-white font-mono font-bold group-hover/token:text-primary transition-colors text-lg">
                    {formatTokenCount(userInfo?.cloudServiceToken || 0)}
                  </span>
                  <div className="flex items-center gap-0.5 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/30 hover:bg-primary/20 transition-colors">
                    <span className="text-xs text-primary font-bold">
                      {t("home.details")}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {t("home.maintainable_date")}{" "}
                  <span className="text-white font-mono">
                    {calculateMaintainableDate()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleSubscribeStorage}
                  className="btn-primary flex items-center justify-center text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                  </svg>
                  {t("home.subscribe_more")}
                </button>

                {account && account.account && (
                  <button
                    onClick={gotoOrderRecords}
                    className="btn-secondary flex items-center justify-center text-sm"
                  >
                    {t("home.subscription_records")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 积分余额 */}
          <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                {t("home.points_balance")}
              </h3>
              <div className="bg-yellow-500/20 p-2 rounded-xl text-yellow-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0 1 1 0 002 0zm-1 4a1 1 0 110-2 1 1 0 010 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col justify-between h-40">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-mono">
                {userInfo?.points || 0}{" "}
                <span className="text-lg text-slate-400 font-sans font-normal">
                  {t("home.points")}
                </span>
              </div>
              <button
                onClick={exchangePoints}
                className={`w-full py-3 px-4 rounded-xl font-medium transition-all ${
                  userInfo?.points && userInfo?.points > 0
                    ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5"
                }`}
              >
                {t("home.exchange_points")}
              </button>
            </div>
          </div>
        </div>

        {/* 登录历史 */}
        <div className="glass-panel p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-secondary rounded-full"></span>
              {t("home.login_history")}
            </h3>
            <button
              onClick={handleRefreshLoginHistory}
              className="text-sm text-primary hover:text-primary-glow transition-colors flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {t("home.refresh")}
            </button>
          </div>

          {displayedLoginHistory.length > 0 ? (
            <div className="space-y-3">
              {displayedLoginHistory.map((item: AuthRecord) => (
                <div
                  key={item.recordId}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold text-lg">
                        {item.appName
                          ? item.appName.charAt(0).toUpperCase()
                          : "A"}
                      </div>
                      <div
                        onClick={() => window.open(item.appUrl, "_blank")}
                        className="cursor-pointer" // 必须添加 cursor-pointer 让用户知道这里可以点击
                      >
                        <h4 className="font-medium text-white">
                          {item.appName}
                        </h4>
                        <p className="text-xs text-slate-400">{item.appUrl}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {displayedLoginHistory.length < loginHistory.length && (
                <button
                  onClick={handleLoadMoreHistory}
                  className="w-full py-3 mt-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-center text-sm transition-colors border border-white/5"
                >
                  {t("home.load_more")}
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>{t("home.no_login_history")}</p>
            </div>
          )}
        </div>

        {/* 应用列表 */}
        {renderAppsSection()}
      </div>

      {/* 存储订阅模态框 */}
      <StorageSubscriptionModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
        // userPoints={userInfo?.points || 0}
      />

      <AccountSwitchModal
        isOpen={showAccountModal}
        onClose={() => setShowAccountModal(false)}
      />

      {/* 积分兑换模态框 */}
      {/* <PointsExchangeModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        userPoints={userInfo?.points || 0}
        onExchange={handleExchangePoints}
      /> */}
    </div>
  );
};

export default Dashboard;
