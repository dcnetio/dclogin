"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Shield, Cloud, Lock, Globe, ArrowLeft, Zap, Server, Key } from "lucide-react";

export default function FeaturesPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Key className="w-8 h-8 text-blue-400" />,
      title: "Decentralized Login",
      description: "Secure authentication for all DC-based Web3 applications. Your identity, your control.",
      gradient: "from-blue-500/20 to-blue-600/5"
    },
    {
      icon: <Cloud className="w-8 h-8 text-violet-400" />,
      title: "Cloud Services",
      description: "Purchase and maintain decentralized cloud resources directly within the app. Seamless and efficient.",
      gradient: "from-violet-500/20 to-violet-600/5"
    },
    {
      icon: <Globe className="w-8 h-8 text-cyan-400" />,
      title: "Fully Decentralized",
      description: "All operations are decentralized. No central authority controls your data or your assets.",
      gradient: "from-cyan-500/20 to-cyan-600/5"
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: "Security & Privacy",
      description: "Your private keys never leave your device. End-to-end encryption ensures your data remains private.",
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
        <button 
          onClick={() => router.push('/home')}
          className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md text-sm font-semibold text-white transition-all hover:scale-105"
        >
          Experience It Now
        </button>
      </header>

      {/* Hero Section */}
      <div className="mb-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
        <h2 className="text-4xl font-bold mb-4 text-white">
          Master Your <span className="text-blue-400">Digital Identity</span>
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto text-lg">
          A unified platform for secure, decentralized identity management and cloud service provisioning.
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
          <div className="text-xs text-gray-400 uppercase tracking-wider">Decentralized</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-violet-400 mb-1">Zero</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Knowledge Proof</div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="text-2xl font-bold text-cyan-400 mb-1">24/7</div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">Availability</div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 text-center">
        <button 
          onClick={() => router.push('/home')}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:-translate-y-1"
        >
          Experience It Now
        </button>
      </div>
    </div>
  );
}
