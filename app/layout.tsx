"use client"; // 标记为客户端组件

import "antd-mobile/es/global";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./layout.module.css";
import StoreProvider from "@/contexts/storeProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import Login from "@/components/auth/login";
import Locales from "./locales";
import Script from "next/script";
import { RefreshProtectionProvider } from "@/contexts/RefreshProtectionContext";
import { ProtectionStatus } from "@/components/ProtectionStatus";
import { StrictRefreshBlocker } from "@/components/RefreshBlocker";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NavBar } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { unstableSetRender } from "antd-mobile";
import { createRoot, Root } from "react-dom/client";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

// 使用 WeakMap 替代在 DOM 元素上添加属性（更干净）
const rootMap = new WeakMap<Element | DocumentFragment, Root>();

unstableSetRender((node, container) => {
  let root = rootMap.get(container);
  if (!root) {
    root = createRoot(container);
    rootMap.set(container, root);
  }

  root.render(node);

  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root!.unmount();
    rootMap.delete(container);
  };
});
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();
  const pathname = usePathname(); // 获取当前路径
  const [showHeader, setShowHeader] = useState(pathname !== "/");
  const [isMobile, setIsMobile] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true); // 用于判断是否是首次访问

  // 定义页面标题
  const getTitle = (pathname: string) => {
    const name = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    switch (name) {
      case "/login":
        return t("login.login");
      case "/register":
        return t("register.register");
      case "/changePassword":
        return t("changePassword.title");
      case "/orders":
        return t("orders.title", "订单列表");
      default:
        return ""; // 默认标题
    }
  };

  useEffect(() => {
    // 路由变化时更新 showHeader
    // 首页、登录页、注册页不显示头部
    const name = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    setShowHeader(name !== "" && name !== "/login" && name !== "/register");
  }, [pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 检查是否是首次访问并存入 sessionStorage
    if (!sessionStorage.getItem("hasVisited")) {
      sessionStorage.setItem("hasVisited", "true");
      setIsFirstVisit(true);
    } else {
      setIsFirstVisit(false);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <Script id="wallet-origin" strategy="beforeInteractive">
          {`globalThis.walletOpenOrigin = window.location.origin;`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-1 relative z-10">
          <StoreProvider>
            <Locales>
              {showHeader && isMobile && (
                <NavBar
                  className="tech-navbar"
                  onBack={
                    isFirstVisit ? undefined : () => window.history.back()
                  } // 根据首次访问状态决定是否显示返回功能
                  right={<LanguageSwitcher />}
                >
                  <div className="text-lg font-bold text-white text-glow">
                    {getTitle(pathname)} {/* 动态标题 */}
                  </div>
                </NavBar>
              )}
              <RefreshProtectionProvider paramName="origin">
                <ToastProvider>
                  <Login />
                  <main className="flex-1 w-full">
                    {children}
                  </main>
                </ToastProvider>
                <ProtectionStatus />
                <StrictRefreshBlocker />
              </RefreshProtectionProvider>
            </Locales>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
