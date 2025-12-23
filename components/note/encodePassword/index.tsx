"use client";
import { Button, Input } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { EncodePasswordType } from "@/config/constant";
import {
  LinkOutline,
  ExclamationCircleOutline,
  CloseOutline,
} from "antd-mobile-icons";
import { CheckShieldOutline } from "@/components/icons/CheckShieldOutline";
import { APPInfo } from "web-dc-api";
import { dcConfig } from "@/config/define";

interface EncodePasswordProps {
  type: number; // 类型，1设置，2验证
  nftAccount: string;
  appInfo: APPInfo;
  cancalFun?: () => void;
  confirmFun: (password: string) => void;
  onForgotPassword?: () => void;
  gotoWebAuth?: () => void; // 可选的WebAuth跳转函数
}

export default function EncodePassword(props: EncodePasswordProps) {
  console.log("EncodePassword rendering");
  const {
    type,
    nftAccount,
    appInfo,
    cancalFun,
    confirmFun,
    onForgotPassword,
    gotoWebAuth,
  } = props;
  const { t } = useTranslation();
  const [password, setPassword] = useState("");

  const gotoConfirm = () => {
    if (!password) {
      window.showToast({
        content: t("encode.password_empty"),
        position: "center",
      });
      return;
    }
    confirmFun(password);
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword();
    }
  };

  const hanldeWebAuth = () => {
    if (gotoWebAuth) {
      gotoWebAuth();
    }
  };

  const close = () => {
    cancalFun?.();
  };

  const canWebAuth =
    typeof window !== "undefined" &&
    typeof window.PublicKeyCredential !== "undefined";

  return (
    <div className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 pt-24 backdrop-blur-sm">
      <div 
        className="bg-slate-900 border border-white/10 rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200"
        style={{ backgroundColor: '#0f172a' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0 bg-slate-900" style={{ backgroundColor: '#0f172a' }}>
          <div className="flex items-center gap-2 text-lg font-bold text-white">
            <LinkOutline fontSize={22} className="text-blue-400" />
            <span>
              {!!appInfo &&
              !!appInfo.appName &&
              appInfo.appId !== dcConfig.appInfo.appId
                ? t("DAPP.info")
                : t("encode.password")}
            </span>
          </div>
          <button
            onClick={close}
            className="text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <CloseOutline fontSize={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 bg-slate-900" style={{ backgroundColor: '#0f172a' }}>
          {/* DAPP Info Section */}
          {!!appInfo &&
            !!appInfo.appName &&
            appInfo.appId !== dcConfig.appInfo.appId && (
              <div className="bg-white/5 rounded-xl p-4 space-y-3 text-sm border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t("DAPP.app")}</span>
                  <span className="font-semibold text-white">
                    {appInfo.appName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t("DAPP.appUrl")}</span>
                  <span className="font-medium text-slate-200 truncate max-w-[200px]">
                    {appInfo.appUrl}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t("DAPP.appVersion")}</span>
                  <span className="font-medium text-slate-200">
                    {appInfo.appVersion}
                  </span>
                </div>
                <div className="flex items-start gap-2 text-orange-400 bg-orange-500/10 p-3 rounded-lg mt-2">
                  <ExclamationCircleOutline className="shrink-0 mt-0.5" />
                  <span className="text-xs leading-relaxed">
                    {t("DAPP.warning")}
                  </span>
                </div>
              </div>
            )}

          {/* Password Input */}
          <div className="space-y-2">
            <div className="border border-white/20 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all bg-black/20 shadow-inner">
              <Input
                placeholder={`请输入 ${nftAccount} 的快捷密码`}
                value={password}
                onChange={setPassword}
                onEnterPress={gotoConfirm}
                clearable
                type="password"
                className="w-full bg-transparent text-lg"
                style={{ 
                  "--font-size": "16px",
                  "--color": "#fff",
                  "--placeholder-color": "#64748b"
                }}
              />
            </div>
            <div className="text-orange-400 text-xs px-1">
              {type === EncodePasswordType.SET
                ? t("encode.set_tip")
                : t("encode.verify_tip")}
            </div>
          </div>

          {/* WebAuth Link */}
          {canWebAuth && (
            <div className="flex justify-end -mt-2">
              <button
                onClick={hanldeWebAuth}
                className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
              >
                使用WebAuth认证
              </button>
            </div>
          )}

          {/* Confirm Button */}
          <Button
            block
            color="primary"
            fill="solid"
            onClick={gotoConfirm}
            className="w-full py-3 text-base font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all"
            style={{
              "--border-radius": "12px",
              "--background-color": "#3b82f6",
              "--text-color": "#ffffff"
            }}
          >
            {t("common.confirm")}
          </Button>

          {/* Forgot Password */}
          <div className="text-center text-sm text-slate-400 pt-2">
            忘记快捷密码?{" "}
            <button
              onClick={handleForgotPassword}
              className="text-blue-400 font-medium hover:underline ml-1"
            >
              重新登录
            </button>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1.5 text-green-400 text-xs pt-4 opacity-80">
            <CheckShieldOutline className="w-4 h-4" />
            <span>{t("common.security_protected")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
