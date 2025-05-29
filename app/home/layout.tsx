"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslation} from 'react-i18next';

export default function HomeLayout({
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
      <NavBar onBack={back}>{t('wallet.wallet')}</NavBar>
      {children}
    </section>
  );
}
