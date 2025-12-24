"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Shield, ExternalLink, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRefreshProtection } from "@/contexts/RefreshProtectionContext";
import { getAllAccounts, generateWalletAccount, resPonseWallet } from "@/services/account";
import AccountSwitchModal from "@/components/modals/AccountSwitchModal";
import { AccountInfo } from "@/types/walletTypes";

export default function DAPPNote() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const authInfo = useAppSelector((state) => state.auth.authInfo);
  const appInfo = useAppSelector((state) => state.auth.appInfo);
  const account = useAppSelector((state) => state.wallet.account);
  const { enabled } = useRefreshProtection();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleLogin = async () => {
    const accounts = await getAllAccounts();
    if (accounts && accounts.length > 0) {
      setShowAccountModal(true);
    } else {
      router.push(`/login${window.location.search}`);
    }
  };

  const handleRegister = () => {
    router.push(`/register${window.location.search}`);
  };

  const handleAuthorize = async () => {
    if (!account) return;
    setIsAuthorizing(true);
    try {
      const wallet = await generateWalletAccount(account.account);
      if (wallet) {
        const origin = searchParams.get("origin") || "";
        const message = { origin };
        await resPonseWallet(wallet.mnemonic.phrase, account, message as any, true, null);
      }
    } catch (error) {
      console.error("Authorization failed", error);
    } finally {
      setIsAuthorizing(false);
    }
  };

  useEffect(() => {
    console.log(
      "debug========refresh protection enabled:",
      enabled,
      new Date()
    );
  }, [enabled]);

  return (
    <div className="min-h-screen">
      <AccountSwitchModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)} 
      />
      {/* 响应式容器 */}
      <div className="min-h-screen flex items-center justify-center px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
          {/* 主要内容区域 */}
          <div className="mt-8 md:mt-8 lg:mt-16 flex flex-col">
            {/* 登录中心介绍区域 */}
            <div className="text-center mobile-order-1">
              {/* Logo和标题 */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-purple-400 mb-2 sm:mb-3 lg:mb-4">
                  统一登录中心
                </h1>
                <p className="text-gray-300 text-sm sm:text-base lg:text-xl leading-relaxed">
                  {t("login.tagline", "一个账户，畅行所有应用")}
                </p>
              </div>

              {/* 登录中心描述 */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base lg:text-lg">
                  {t(
                    "login.description",
                    "统一登录中心提供安全便捷的身份认证服务，让您使用一个账户即可访问所有授权应用，无需重复注册和登录。"
                  )}
                </p>
              </div>
            </div>
            {/* 授权状态区域 */}
            <div className="flex justify-center items-center mobile-order-2 sm:mt-8 lg:mt-0">
              <div 
                className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl backdrop-blur-sm"
                style={{ backgroundColor: '#0f172a' }}
              >
                {/* 头部区域 */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-400 text-sm sm:text-base">
                    {authInfo.content}
                  </p>
                </div>

                {/* 应用信息卡片 */}
                {!!appInfo && !!appInfo.appId && (
                  <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <ExternalLink className="w-5 h-5 mr-2 text-blue-400" />
                        应用信息
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {appInfo.appId && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">
                            应用名称
                          </span>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-slate-200">
                              {appInfo.appName} ({appInfo.appId})
                            </span>
                            {appInfo.appIcon && (
                              <Image
                                src={appInfo.appIcon}
                                alt="App Icon"
                                className="w-5 h-5 ml-2 rounded"
                                width={40}
                                height={40}
                                priority={true}
                              />
                            )}
                          </div>
                        </div>
                      )}

                      {appInfo.appUrl && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">
                            应用地址
                          </span>
                          <span className="text-sm font-medium text-slate-200 truncate max-w-48">
                            {appInfo.appUrl}
                          </span>
                        </div>
                      )}

                      {appInfo.appVersion && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">版本号</span>
                          <span className="text-sm font-medium text-slate-200">
                            {appInfo.appVersion}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                        <p className="text-amber-200 text-xs sm:text-sm font-medium">
                          ⚠️{" "}
                          {t("DAPP.warning", "请确认应用信息后再进行授权登录")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* 登录注册按钮 */}
                {!!authInfo.needLogin && (
                  <div className="space-y-3 mb-6">
                    {account && account.account ? (
                      <button
                        onClick={handleAuthorize}
                        disabled={isAuthorizing}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 ease-in-out shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        <div className="flex items-center justify-center">
                          {isAuthorizing ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <CheckCircle className="w-5 h-5 mr-2" />
                          )}
                          {isAuthorizing ? "授权中..." : "确认授权"}
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={handleLogin}
                        className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 ease-in-out shadow-blue-500/20"
                      >
                        <div className="flex items-center justify-center">
                          <User className="w-5 h-5 mr-2" />
                          登录账户
                        </div>
                      </button>
                    )}

                    <button
                      onClick={handleRegister}
                      className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-[1.02] transition-all duration-200 ease-in-out shadow-emerald-500/20"
                    >
                      <div className="flex items-center justify-center">
                        <User className="w-5 h-5 mr-2" />
                        {account && account.account ? "切换账号" : "注册新账户"}
                      </div>
                    </button>
                  </div>
                )}

                {/* 安全提示 */}
                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20">
                    <Shield className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-sm text-green-400 font-medium">
                      您的账户安全由统一登录中心保护
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="text-center mt-6 sm:mt-8 lg:mt-10">
            <p className="text-sm text-gray-400">
              统一登录中心 • 安全便捷的身份认证服务
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
