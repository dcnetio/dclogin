"use client";
import { NavBar, SafeArea } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslation} from 'react-i18next';

export default function ActivityLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const router = useRouter()
  const { t } = useTranslation()

  const back = () => {
    router.back()
  }
  return (
    <section>
      <div>
        <SafeArea position="top" />
      </div>
      <NavBar onBack={back}>{t('transfer.activity')}</NavBar>
      {children}
      <div>
        <SafeArea position="bottom" />
      </div>
    </section>
  );
}
