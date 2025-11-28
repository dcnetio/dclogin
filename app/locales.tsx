"use client";
import { useEffect } from "react";
import i18next from "i18next";
import { I18nextProvider } from 'react-i18next';
import i18n from "@/locales/i18n";
import { I18N_LANGUAGES } from '@/config/constant';

function getSystemLanguage() {
  // 检查是否在浏览器环境
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'en-US'; // 服务端默认值
  }
  if (navigator.languages && navigator.languages.length) {
    return navigator.languages[0]; // 返回浏览器指定的语言列表中的第一个
  }
  return navigator.language; // 返回浏览器指定的语言
}

export default function Locales({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // 🔥 立即设置默认语言
    i18next.changeLanguage('en');
    
    // 🔥 微任务中异步检测语言
    Promise.resolve().then(() => {
      const lang = navigator?.languages?.[0]?.includes('zh') ? 'zh' : 'en';
      i18next.changeLanguage(lang);
    });
  }, []);
  // const systemLanguage = getSystemLanguage(); // 调用函数获取系统语言
  // console.log("systemLanguage", systemLanguage); // 输出系统语言
  
  // 将语言切换逻辑移到 useEffect 中，避免渲染时更新状态
  // useEffect(() => {
  //   const selectedLanguage = systemLanguage.indexOf('zh') !== -1 ? I18N_LANGUAGES.ZH : I18N_LANGUAGES.EN;
  //   i18next.changeLanguage(selectedLanguage);
  // }, [systemLanguage]);
  
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}