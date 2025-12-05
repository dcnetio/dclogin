"use client";
import { useEffect } from "react";
import i18next from "i18next";
import { I18nextProvider } from 'react-i18next';
import i18n from "@/locales/i18n";
import { I18N_LANGUAGES } from '@/config/constant';

export default function Locales({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}