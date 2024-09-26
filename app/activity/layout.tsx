"use client";
import { NavBar, SafeArea } from "antd-mobile";
import { useRouter } from "next/navigation";

export default function ActivityLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()

  const back = () => {
    router.back()
  }
  return (
    <section>
      <div>
        <SafeArea position="top" />
      </div>
      <NavBar onBack={back}>活动</NavBar>
      {children}
      <div>
        <SafeArea position="bottom" />
      </div>
    </section>
  );
}
