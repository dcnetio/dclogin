"use client";
import React from "react";
import styles from "./page.module.css";
import { useAppSelector } from "@/lib/hooks";
import { useTranslation } from "next-i18next";
import { useSearchParams, useRouter } from "next/navigation";
import { User, Shield, ExternalLink } from "lucide-react";

export default function Auth() {
  const router = useRouter();
  const { t } = useTranslation();
  const authInfo = useAppSelector((state) => state.auth.authInfo);
  const appInfo = useAppSelector((state) => state.auth.appInfo);
  console.log("authInfo=========", authInfo);
  const handleLogin = () => {
    router.push("/login" + window.location.search);
  };
  const handleRegister = () => {
    router.push("/register" + window.location.search);
  };
  return (
    <div className={styles["min-h-screen"]}>
      {/* 响应式容器 */}
      <div
        className={`${styles["min-h-screen"]} ${styles.flex} ${styles["items-center"]} ${styles["justify-center"]} px-3 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8`}
      >
        <div className="w-full max-w-xs sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
          {/* 主要内容区域 */}
          <div
            className={`${styles["mobile-stack"]} flex flex-col `}
          >
            {/* DCWallet介绍区域 */}
            <div className="text-center mobile-order-1">
              {/* Logo和标题 */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-purple-600 mb-2 sm:mb-3 lg:mb-4">
                  DCWallet
                </h1>
                <p className="text-gray-600 text-sm sm:text-base lg:text-xl leading-relaxed">
                  您通往新一代互联网的安全入口
                </p>
              </div>

              {/* DCWallet描述 */}
              <div className="mb-4 sm:mb-6 lg:mb-8">
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg">
                  DCWallet
                  是基于去中心化云服务开发的统一登录工具，不存储任何用户隐私信息。
                </p>
              </div>

            </div>
            {/* 授权状态区域 */}
            <div className="flex justify-center items-center mobile-order-2 sm:mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
                  {/* 头部区域 */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {authInfo.content}
                    </p>
                  </div>

                  {/* 应用信息卡片 */}
                  {!!appInfo && !!appInfo.appId  && (
                    <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                          应用信息
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {appInfo.appId && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              应用名称
                            </span>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-800">
                                {appInfo.appName} ({appInfo.appId})
                              </span>
                              {appInfo.appIcon && (
                                <img
                                  src={appInfo.appIcon}
                                  alt="App Icon"
                                  className="w-5 h-5 ml-2 rounded"
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {appInfo.appUrl && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              应用地址
                            </span>
                            <span className="text-sm font-medium text-gray-800 truncate max-w-48">
                              {appInfo.appUrl}
                            </span>
                          </div>
                        )}

                        {appInfo.appVersion && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              版本号
                            </span>
                            <span className="text-sm font-medium text-gray-800">
                              {appInfo.appVersion}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                          <p className="text-amber-800 text-xs sm:text-sm font-medium">
                            ⚠️ {t("DAPP.warning")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* 登录注册按钮 */}
                  {!!authInfo.needLogin && (<div className="space-y-3 mb-6">
                    <button
                      onClick={handleLogin}
                      className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium shadow-lg hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center justify-center">
                        <User className="w-5 h-5 mr-2" />
                        登录账户
                      </div>
                    </button>

                    <button
                      onClick={handleRegister}
                      className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium shadow-lg hover:from-emerald-700 hover:to-emerald-800 transform hover:scale-[1.02] transition-all duration-200 ease-in-out"
                    >
                      <div className="flex items-center justify-center">
                        <User className="w-5 h-5 mr-2" />
                        注册新账户
                      </div>
                    </button>
                  </div>)}

                  {/* 安全提示 */}
                  <div className="text-center">
                    <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full border border-green-200">
                      <Shield className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-sm text-green-700 font-medium">
                        您的隐私信息受到完全保护
                      </span>
                    </div>
                  </div>
               
              </div>
            </div>
          </div>


          {/* DCWallet开源地址 */}
          <div className="text-center mt-6 sm:mt-8 lg:mt-10">
            <p className="text-sm text-gray-400">
              DCWallet 开源地址 • Powered by Decentralized Cloud Services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
