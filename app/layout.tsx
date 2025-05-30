import 'antd-mobile/es/global';
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import styles from "./layout.module.css";
import StoreProvider from "@/context/storeProvider";
import { ToastProvider } from "@/context/ToastProvider";

import VConsole from "@/components/vConsole";
import Login from "@/components/auth/login";
import Locales from "./locales";
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
    { url: "/favicon.ico", type: "image/x-icon", sizes: "256x256" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={styles.container}>
          <StoreProvider>
            <Locales>
              <VConsole>
                <ToastProvider>
                  <Login />
                  {children}
                  </ToastProvider>
              </VConsole>
            </Locales>
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
