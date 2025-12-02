"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function ChangePasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const back = () => {
    router.back();
  };

  // PC端不显示导航栏
  if (!isMobile) {
    return <section className={styles.pcContainer}>{children}</section>;
  }

  // 移动端显示导航栏
  return (
    <section className={styles.mobileContainer}>
      <NavBar onBack={back}>{t("changePassword.change_password")}</NavBar>
      {children}
    </section>
  );
}
