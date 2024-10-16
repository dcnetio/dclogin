"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";

export default function TransferConfirmLayout({
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
      <NavBar onBack={back}>编辑</NavBar>
      {children}
    </section>
  );
}
