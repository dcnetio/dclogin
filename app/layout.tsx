import "antd-mobile/es/global";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./layout.module.css";
import StoreProvider from "@/contexts/storeProvider";
import { ToastProvider } from "@/contexts/ToastProvider";

import VConsole from "@/components/vConsole";
import Login from "@/components/auth/login";
import Locales from "./locales";
import { basePath } from "@/config/define";
import Script from "next/script";
import { RefreshProtectionProvider } from "@/contexts/RefreshProtectionContext";
import { ProtectionStatus } from "@/components/ProtectionStatus";
import { StrictRefreshBlocker } from "@/components/RefreshBlocker";

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

export const metadata: Metadata = {
  title: "DC Wallet",
  description: "DC Wallet",
  icons: [
    { url: basePath + "/favicon.ico", type: "image/x-icon", sizes: "256x256" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="wallet-origin" strategy="beforeInteractive">
          {`globalThis.walletOpenOrgin = window.location.origin;`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={styles.container}>
          <StoreProvider>
            <Locales>
              <VConsole>
                <RefreshProtectionProvider>
                  <ToastProvider>
                    <Login />
                    {children}
                  </ToastProvider>
                  <ProtectionStatus />
                  <StrictRefreshBlocker />
                </RefreshProtectionProvider>
              </VConsole>
            </Locales>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
