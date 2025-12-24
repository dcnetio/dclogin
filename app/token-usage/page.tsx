"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

const CONSUMPTION_RULES = [
  { action: "存储空间费率", cost: "约15/GB/天" },
  { action: "切换可访问节点", cost: "约2" },
  { action: "个人数据库整理", cost: "约2" },
  { action: "新增应用账号关联", cost: "约2" },
  { action: "移除应用账号关联", cost: "约2" },
  { action: "转让账号", cost: "约2" },
  { action: "上传文件", cost: "约2" },
  { action: "删除文件", cost: "约2" },
  { action: "垃圾信息举报", cost: "约2" },
  { action: "创建群组", cost: "约2" },
];

export default function TokenUsagePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen text-white pb-20 pt-4 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="hidden min-[769px]:block mr-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold">云服务Token介绍</h1>
          </div>
          <div className="hidden min-[769px]:block">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">什么是云服务Token?</h2>
            <div className="text-slate-200 leading-relaxed text-base md:text-lg space-y-4">
              <p>
                <span className="font-bold text-white">云服务Token</span> 是DC云服务中维持数据存储的资源单位。它会被存储套餐以及一些日常操作逐渐消耗掉。
              </p>
              <p>
                当Token完全消耗掉时，就需要及时购买补充，否则存储在DC平台的数据可能会被释放。
              </p>
              <p className="bg-white/5 p-4 rounded-lg border-l-4 border-primary">
                当前购买方式和存储套餐进行绑定：购买对应的存储套餐时，会自动赠送维持该存储套餐 <span className="text-white font-bold">1年量</span> 对应的云服务Token。
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-4">消耗规则列表</h2>
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 bg-white/5 p-4 font-bold text-slate-200 text-lg">
                <div>操作</div>
                <div className="text-right">消耗Token</div>
              </div>
              {CONSUMPTION_RULES.map((rule, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 p-4 border-t border-white/5 text-slate-400 hover:bg-white/5 transition-colors"
                >
                  <div>{rule.action}</div>
                  <div className="text-right">{rule.cost}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
