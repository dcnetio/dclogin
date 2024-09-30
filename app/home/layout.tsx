"use client";
import { SafeArea } from "antd-mobile";
import Login from "@/app/home/auth/login";
import StoreProvider from "@/context/storeProvider";

export default function HomeLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div>
        <SafeArea position="top" />
      </div>
      <StoreProvider>
        <Login />
        {children}
      </StoreProvider>
      <div>
        <SafeArea position="bottom" />
      </div>
    </section>
  );
}
