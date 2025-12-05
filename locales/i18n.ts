// i18n.ts
import i18n from 'i18next'
import languageDetector from 'i18next-browser-languagedetector'
// import i18nextHttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'

import { I18N_LANGUAGES } from '@/config/constant';

console.log('Object.values(I18N_LANGUAGES)', Object.values(I18N_LANGUAGES))
// 假设你有一个名为locals的文件夹，里面包含了你的翻译资源
import translationEN from './en/translation.json';
import translationZH from './zh/translation.json';
 
const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  }
};
 
i18n
  // .use(i18nextHttpBackend)
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug: false,
    supportedLngs: Object.values(I18N_LANGUAGES),
    fallbackLng: I18N_LANGUAGES.ZH,
    load: 'languageOnly', // 只加载语言代码，忽略区域代码（如 zh-CN -> zh）
    detection: {
      order: ['localStorage', 'navigator'], // 优先从 localStorage 获取，如果没有则检测浏览器语言
      caches: ['localStorage'], // 缓存语言到 localStorage
    },
    interpolation: { escapeValue: false },
    // i18next-http-backend translation file path
    // https://github.com/i18next/i18next-http-backend
    // backend: {
    //   path: './{{lng}}/{{ns}}.json',
    // },
    resources,
  })

export default i18n