"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

export default function TransferConfirmLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const back = () => {
    router.back();
  };
  return (
    <section>
      <NavBar onBack={back} right={<LanguageSwitcher />}>{t('common.edit')}</NavBar>
      {children}
    </section>
  );
}
