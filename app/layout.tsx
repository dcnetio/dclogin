import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "antd-mobile/es/global";
import styles from "./layout.module.css";
import StoreProvider from "@/context/storeProvider";
// import VConsole from "@/components/vConsole";
import Login from "@/components/login";
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
  description: "DC Wallet 钱包",
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
            {/* <VConsole> */}
            <Login />
            {children}
            {/* </VConsole> */}
          </StoreProvider>
        </div>
      </body>
    </html>
  );
}
