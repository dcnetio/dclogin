"use client";
import { SafeArea } from "antd-mobile";

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
      {children}
      <div>
        <SafeArea position="bottom" />
      </div>
    </section>
  );
}
