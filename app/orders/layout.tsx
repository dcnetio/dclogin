"use client";
import { NavBar } from "antd-mobile";
import { useRouter } from "next/navigation";
import { useTranslation } from 'react-i18next';
import { ChevronLeft } from "lucide-react";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { t } = useTranslation();

  const back = () => {
    router.back();
  };

  return (
    <section className="min-h-screen flex flex-col">
      <div className="hidden md:block sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
        <NavBar 
          onBack={back} 
          backArrow={<ChevronLeft className="text-white" size={24} />}
          style={{
            '--adm-color-text': '#ffffff',
            backgroundColor: 'transparent',
          } as any}
        >
          <span className="text-white font-bold text-lg">
            {t('orders.title', '订单列表')}
          </span>
        </NavBar>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </section>
  );
}
