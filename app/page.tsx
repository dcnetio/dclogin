"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Cloud, Lock, Globe, ArrowLeft, Zap, Server, Key, Languages } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { I18N_LANGUAGES } from "@/config/constant";

export default function FeaturesPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [apps] = useState<any[]>([]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const features = [
    {
      icon: <Key className="w-8 h-8 text-blue-400" />,
      title: t("home.feature_login_title"),
      description: t("home.feature_login_desc"),
      gradient: "from-blue-500/20 to-blue-600/5"
    },
    {
      icon: <Cloud className="w-8 h-8 text-violet-400" />,
      title: t("home.feature_cloud_title"),
      description: t("home.feature_cloud_desc"),
      gradient: "from-violet-500/20 to-violet-600/5"
    },
    {
      icon: <Globe className="w-8 h-8 text-cyan-400" />,
      title: t("home.feature_decentralized_title"),
      description: t("home.feature_decentralized_desc"),
      gradient: "from-cyan-500/20 to-cyan-600/5"
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: t("home.feature_security_title"),
      description: t("home.feature_security_desc"),
      gradient: "from-emerald-500/20 to-emerald-600/5"
    }
  ];

  return (
    <div className="min-h-screen p-6 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="DCLogin" className="w-10 h-10 rounded-xl shadow-lg" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            DCLogin
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
              <Languages size={20} />
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 py-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <button 
                onClick={() => changeLanguage(I18N_LANGUAGES.ZH)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${i18n.language === I18N_LANGUAGES.ZH ? 'text-blue-400' : 'text-slate-300'}`}
              >
                中文
              </button>
              <button 
                onClick={() => changeLanguage(I18N_LANGUAGES.EN)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${i18n.language === I18N_LANGUAGES.EN ? 'text-blue-400' : 'text-slate-300'}`}
              >
                English
              </button>
            </div>
          </div>
          <button 
            onClick={() => router.push('/home')}
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-sm font-semibold text-white transition-all hover:scale-105"
          >
            {t("home.experience_now")}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="mb-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <h2 className="text-4xl font-bold mb-4 text-white">
          <Trans i18nKey="home.slogan_title" components={{ 1: <span className="text-blue-400" /> }} />
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto text-lg">
          {t("home.slogan_desc")}
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`
              relative overflow-hidden rounded-2xl p-6 border border-white/10 backdrop-blur-sm
              bg-gradient-to-br ${feature.gradient}
              hover:border-white/20 transition-all duration-300 hover:scale-[1.02] group
            `}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              {feature.icon}
            </div>
            
            <div className="relative z-10">
              <div className="mb-4 p-3 bg-white/5 rounded-xl w-fit backdrop-blur-md border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stats / Trust Section */}
      <div className="mt-16 grid grid-cols-3 gap-4 max-w-4xl mx-auto text-center">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-blue-400 mb-1">100%</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">{t("home.stat_decentralized")}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-violet-400 mb-1">Zero</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">{t("home.stat_zkp")}</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-cyan-400 mb-1">24/7</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">{t("home.stat_availability")}</div>
        </div>
      </div>

      {/* App List Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="glass-panel p-6 rounded-2xl text-left border border-white/10 bg-white/5 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-green-500 rounded-full"></span>
            {t("home.recommended_apps")}
          </h3>
          {apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl p-4 flex items-center transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <img
                    src={
                      app.iconUrl ||
                      "https://images.unsplash.com/photo-1637593992672-ed85a851fdc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    }
                    alt={app.name}
                    className="w-12 h-12 rounded-xl mr-4 object-cover shadow-lg"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1637593992672-ed85a851fdc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80";
                    }}
                  />
                  <div>
                    <h4 className="font-medium text-white">{app.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{app.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>{t("home.under_review")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <button 
          onClick={() => router.push('/home')}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-1"
        >
          {t("home.experience_now")}
        </button>
      </div>
    </div>
  );
}
