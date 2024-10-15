"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

export default function TransferLayout({
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
      <NavBar onBack={back}>转账</NavBar>
      {children}
    </section>
  );
}
