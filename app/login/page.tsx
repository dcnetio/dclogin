"use client";
import React from "react";
// import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, Input } from "antd-mobile";
import { createAccountWithLogin } from "@/app/index";
import { getDC } from "@/components/auth/login/dc";
import { store } from "@/lib/store";
import { saveInitState } from "@/lib/slices/appSlice";
import { appState } from "@/config/constant";
import { UserOutline, LockOutline, AppOutline, LinkOutline, GlobalOutline } from "antd-mobile-icons";
import { CheckShieldOutline } from "@/components/icons/CheckShieldOutline";

export default function Login() {
  // 保持现有的 state 和 hooks
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin") || "";
  const router = useRouter();
  const { t } = useTranslation();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [safecode, setSafecode] = useState("000000");
  const [isMobile, setIsMobile] = useState(true);
  const [showSafecode, setShowSafecode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const gotoConfirm = async () => {
    // Set loading state to true when login starts
    setIsLoading(true);

    // Validate input
    if (!account) {
      window.showToast({
        content: t("login.account_empty"),
        position: "center",
      });
      setIsLoading(false); // Reset loading state
      return;
    }
    const dc = getDC();
    if (!dc || !dc.auth) {
      window.showToast({
        content: "dc模块未加载完成，请稍后再登录",
        position: "center",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await createAccountWithLogin(
        account,
        password,
        safecode,
        origin
      );
      console.log("accountLogin res", res);

      // Reset loading state after login completes
      setIsLoading(false);

      if (res && res.success) {
        // window.showToast({
        //   content: t("login.success"),
        //   position: "center",
        // });

        store.dispatch(saveInitState(appState.init_success));
        router.push("/");
        return;
      }

      window.showToast({
        content: t("login.failed"),
        position: "center",
      });
    } catch (error) {
      // Reset loading state if there's an error
      setIsLoading(false);

      console.log("accountLogin error", error);
      window.showToast({
        content: t("login.failed"),
        position: "center",
      });
    }
  };

  const gotoRegister = () => {
    router.push(`/register${window.location.search}`);
  };

  const toggleSafecode = () => {
    setShowSafecode(!showSafecode);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Branding Section - Desktop Only */}
        <div className="hidden md:flex flex-col text-white space-y-8 p-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <div className="w-8 h-8 border-2 border-white rounded-full" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 pb-2">
              {t("wallet.name", "DCLogin")}
            </h1>
            <p className="text-xl text-blue-100/80 max-w-md">
              {t("wallet.tagline", "您通往新一代互联网的安全入口")}
            </p>
          </div>

          <div className="space-y-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-primary">
              {t("wallet.services_title", "DCLogin 提供的服务")}
            </h3>
            <ul className="space-y-4">
              {[
                { icon: <AppOutline fontSize={18} />, text: t("wallet.service1", "跨应用统一登录") },
                { icon: <LinkOutline fontSize={18} />, text: t("wallet.service2", "跨终端无缝衔接") },
                { icon: <GlobalOutline fontSize={18} />, text: t("wallet.service3", "去中心化云服务") },
                { icon: <CheckShieldOutline fontSize={18} />, text: t("wallet.service4", "极致的安全保障") },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3 text-sm text-slate-300">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-4">
             <a
                href="https://github.com/dcnetio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                <span>{t("wallet.github_link", "DCLogin 开源地址")}</span>
              </a>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="md:hidden w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 mx-auto mb-4">
              <div className="w-6 h-6 border-2 border-white rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t("login.title", "DCLogin")}</h2>
            <p className="text-slate-400 text-sm">
              {t("login.subtitle", "您正在使用去中心化统一登录")}
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <UserOutline fontSize={20} />
                </div>
                <Input
                  placeholder={t("login.account")}
                  value={account}
                  onChange={setAccount}
                  onEnterPress={gotoConfirm}
                  clearable
                  className="input-tech pl-10 !bg-slate-800/50 !border-slate-700 focus:!border-primary"
                  style={{ '--font-size': '16px', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <LockOutline fontSize={20} />
                </div>
                <Input
                  placeholder={t("login.password")}
                  value={password}
                  onChange={setPassword}
                  onEnterPress={gotoConfirm}
                  clearable
                  type="password"
                  className="input-tech pl-10 !bg-slate-800/50 !border-slate-700 focus:!border-primary"
                  style={{ '--font-size': '16px', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="space-y-1">
              {showSafecode ? (
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <CheckShieldOutline fontSize={20} />
                  </div>
                  <Input
                    placeholder={t("login.safecode")}
                    value={safecode}
                    onChange={setSafecode}
                    onEnterPress={gotoConfirm}
                    clearable
                    className="input-tech pl-10 !bg-slate-800/50 !border-slate-700 focus:!border-primary"
                    style={{ '--font-size': '16px', paddingLeft: '2.5rem' }}
                  />
                </div>
              ) : (
                <div 
                  className="text-sm text-primary hover:text-primary/80 cursor-pointer text-right transition-colors" 
                  onClick={toggleSafecode}
                >
                  {t("login.input_safecode", "输入安全码")}
                </div>
              )}
            </div>

            <Button
              block
              className="btn-primary !rounded-xl !h-12 !text-base !font-semibold mt-6"
              onClick={gotoConfirm}
              loading={isLoading}
              loadingText={t("login.logging_in", "登录中...")}
            >
              {t("login.login", "登录")}
            </Button>

            <div className="text-center mt-6">
              <span className="text-slate-400 text-sm">{t("login.no_account", "没有账户?")} </span>
              <span 
                className="text-primary font-medium cursor-pointer hover:underline ml-1"
                onClick={gotoRegister}
              >
                {t("login.register_now", "立即注册")}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Services List */}
        <div className="md:hidden w-full max-w-md mx-auto mt-8 px-4 pb-8">
          <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-primary text-center">
              {t("wallet.services_title", "DCLogin 提供的服务")}
            </h3>
            <ul className="space-y-4">
              {[
                { icon: <AppOutline fontSize={18} />, text: t("wallet.service1", "跨应用统一登录") },
                { icon: <LinkOutline fontSize={18} />, text: t("wallet.service2", "跨终端无缝衔接") },
                { icon: <GlobalOutline fontSize={18} />, text: t("wallet.service3", "去中心化云服务") },
                { icon: <CheckShieldOutline fontSize={18} />, text: t("wallet.service4", "极致的安全保障") },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3 text-sm text-slate-300">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
