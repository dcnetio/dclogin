"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useTranslation, Trans } from "react-i18next";

export default function TokenUsagePage() {
  const router = useRouter();
  const { t } = useTranslation();

  const CONSUMPTION_RULES = [
    { action: t("token_usage.rules.storage_rate"), cost: t("token_usage.rules.cost_gb_day") },
    { action: t("token_usage.rules.switch_node"), cost: t("token_usage.rules.cost_approx_2") },
    { action: t("token_usage.rules.db_cleanup"), cost: t("token_usage.rules.cost_approx_2") },
    { action: t("token_usage.rules.add_account_link"), cost: t("token_usage.rules.cost_approx_2") },
    { action: t("token_usage.rules.remove_account_link"), cost: t("token_usage.rules.cost_approx_2") },
    { action: t("token_usage.rules.transfer_account"), cost: t("token_usage.rules.cost_approx_2") },
    { action: t("token_usage.rules.upload_file"), cost: t("token_usage.rules.cost_approx_2") },
    { action: t("token_usage.rules.delete_file"), cost: t("token_usage.rules.cost_approx_2") },
    { action: t("token_usage.rules.report_spam"), cost: t("token_usage.rules.cost_approx_2") },
    { action: t("token_usage.rules.create_group"), cost: t("token_usage.rules.cost_approx_2") },
  ];

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
            <h1 className="text-2xl font-bold">{t("token_usage.title")}</h1>
          </div>
          <div className="hidden min-[769px]:block">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold text-primary mb-4">{t("token_usage.what_is_title")}</h2>
            <div className="text-slate-200 leading-relaxed text-base md:text-lg space-y-4">
              <p>
                <Trans
                  i18nKey="token_usage.what_is_desc_1"
                  components={[<span className="font-bold text-white" key="0" />]}
                />
              </p>
              <p>
                {t("token_usage.what_is_desc_2")}
              </p>
              <p className="bg-white/5 p-4 rounded-lg border-l-4 border-primary">
                <Trans
                  i18nKey="token_usage.what_is_desc_3"
                  components={[<span className="text-white font-bold" key="0" />]}
                />
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary mb-4">{t("token_usage.consumption_rules_title")}</h2>
            <div className="border border-white/10 rounded-xl overflow-hidden">
              <div className="grid grid-cols-2 bg-white/5 p-4 font-bold text-slate-200 text-lg">
                <div>{t("token_usage.table_header_action")}</div>
                <div className="text-right">{t("token_usage.table_header_cost")}</div>
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
