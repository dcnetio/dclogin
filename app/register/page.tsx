"use client";
// import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, Input } from "antd-mobile";
import { createAccountWithRegister } from "@/app/index";
import { getDC } from "@/components/auth/login/dc";
import { UserOutline, LockOutline, AppOutline, LinkOutline, GlobalOutline } from "antd-mobile-icons";
import { CheckShieldOutline } from "@/components/icons/CheckShieldOutline";

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const gotoConfirm = async () => {
    // Set loading state to true when registration starts
    setIsLoading(true);

    try {
      // 检查账号是否为空
      if (!account) {
        window.showToast({
          content: t("register.account_empty", "请输入账号"),
          position: "center",
        });
        setIsLoading(false); // Reset loading state
        return;
      }

      // 检查密码是否为空
      if (!password) {
        window.showToast({
          content: t("register.password_empty", "请输入密码"),
          position: "center",
        });
        setIsLoading(false); // Reset loading state
        return;
      }
      // 检查密码长度
      if (password.length < 2) {
        window.showToast({
          content: t("register.password_length", "密码长度至少2位"),
          position: "center",
        });
        setIsLoading(false); // Reset loading state
        return;
      }

      // 检查确认密码是否输入
      if (!confirmPassword) {
        window.showToast({
          content: t("register.confirm_password_empty", "请确认您的密码"),
          position: "center",
        });
        setIsLoading(false); // Reset loading state
        return;
      }

      // 确认两次输入的密码是否匹配
      if (password !== confirmPassword) {
        window.showToast({
          content: t("register.passwords_not_match", "两次输入的密码不一致"),
          position: "center",
        });
        setPasswordsMatch(false);
        setIsLoading(false); // Reset loading state
        return;
      }

      // 继续现有的账户创建逻辑
      const dc = getDC();
      if (!dc || !dc.auth) {
        window.showToast({
          content: "dc模块未加载完成，请稍后再注册",
          position: "center",
        });
        setIsLoading(false); // Reset loading state
        return;
      }

      const res = await createAccountWithRegister(account, password, "000000");
      // Reset loading state after registration completes
      setIsLoading(false);

      if (res && res.success) {
        window.showToast({
          content: t("register.success", "注册成功"),
          position: "center",
        });
        router.push(`/login${window.location.search}`);
        return;
      }
    } catch (error) {
      // Reset loading state if there's an error
      setIsLoading(false);

      console.log("Register error", error);
      window.showToast({
        content: t("register.failed", "注册失败"),
        position: "center",
      });
    }
  };

  const gotoLogin = () => {
    router.push(`/login${window.location.search}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Branding Section - Desktop Only */}
        <div className="hidden md:flex flex-col text-white space-y-8 p-8 order-2 md:order-1">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <div className="w-8 h-8 border-2 border-white rounded-full" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 pb-2">
              {t("wallet.name", "DCLogin")}
            </h1>
            <p className="text-xl text-blue-100/80 max-w-md">
              {t("wallet.tagline", "您通往新一代互联网的安全入口")}
            </p>
          </div>

          <div className="space-y-6 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-primary">
              {t("wallet.services_title", "DCLogin 提供的服务")}
            </h3>
            <ul className="space-y-4">
              {[
                { icon: <AppOutline fontSize={18} />, text: t("wallet.service1", "跨应用统一登录") },
                { icon: <LinkOutline fontSize={18} />, text: t("wallet.service2", "跨终端无缝衔接") },
                { icon: <GlobalOutline fontSize={18} />, text: t("wallet.service3", "去中心化云服务") },
                { icon: <CheckShieldOutline fontSize={18} />, text: t("wallet.service4", "极致的安全保障") },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3 text-sm text-slate-300">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Register Form Section */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl w-full max-w-md mx-auto order-1 md:order-2">
          <div className="text-center mb-8">
            <div className="md:hidden w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 mx-auto mb-4">
              <div className="w-6 h-6 border-2 border-white rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t("register.register", "DCLogin")}</h2>
            <p className="text-slate-400 text-sm">
              {t("register.subtitle", "创建私人账户，开启您的智能互联网之旅")}
            </p>
          </div>

          <div className="space-y-5">
            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <UserOutline fontSize={20} />
                </div>
                <Input
                  placeholder={t("register.account")}
                  value={account}
                  onChange={setAccount}
                  onEnterPress={gotoConfirm}
                  clearable
                  className="input-tech pl-10 !bg-slate-800/50 !border-slate-700 focus:!border-primary"
                  style={{ '--font-size': '16px', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <LockOutline fontSize={20} />
                </div>
                <Input
                  placeholder={t("register.password")}
                  value={password}
                  onChange={(val) => {
                    setPassword(val);
                    if (confirmPassword && val !== confirmPassword) {
                      setPasswordsMatch(false);
                    } else {
                      setPasswordsMatch(true);
                    }
                  }}
                  onEnterPress={() =>
                    document.getElementById("confirmPasswordInput")?.focus()
                  }
                  clearable
                  type="password"
                  className="input-tech pl-10 !bg-slate-800/50 !border-slate-700 focus:!border-primary"
                  style={{ '--font-size': '16px', paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            {password.length > 0 && (
              <div className="space-y-1">
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                    <CheckShieldOutline fontSize={20} />
                  </div>
                  <Input
                    id="confirmPasswordInput"
                    placeholder={t("register.confirm_password_placeholder", "请再次输入密码")}
                    value={confirmPassword}
                    onChange={(val) => {
                      setConfirmPassword(val);
                      setPasswordsMatch(val === password);
                    }}
                    onEnterPress={gotoConfirm}
                    clearable
                    type="password"
                    className={`input-tech pl-10 !bg-slate-800/50 !border-slate-700 focus:!border-primary ${
                      confirmPassword.length > 0 && !passwordsMatch ? '!border-red-500 focus:!border-red-500' : ''
                    }`}
                    style={{ '--font-size': '16px', paddingLeft: '2.5rem' }}
                  />
                </div>
                {confirmPassword.length > 0 && !passwordsMatch && (
                  <div className="text-red-400 text-xs pl-1">
                    {t("register.passwords_not_match", "两次输入的密码不一致")}
                  </div>
                )}
              </div>
            )}

            <Button
              block
              className="btn-primary !rounded-xl !h-12 !text-base !font-semibold mt-6"
              onClick={() => gotoConfirm()}
              loading={isLoading}
              loadingText={t("register.registering", "注册中...")}
            >
              {t("register.register", "注册")}
            </Button>

            <div className="text-center mt-6">
              <span className="text-slate-400 text-sm">{t("register.have_account", "已有账户?")} </span>
              <span 
                className="text-primary font-medium cursor-pointer hover:underline ml-1"
                onClick={gotoLogin}
              >
                {t("register.go_login", "前往登录")}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Services List */}
        <div className="md:hidden w-full max-w-md mx-auto mt-8 px-4 pb-8 order-3">
          <div className="space-y-4 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-primary text-center">
              {t("wallet.services_title", "DCLogin 提供的服务")}
            </h3>
            <ul className="space-y-4">
              {[
                { icon: <AppOutline fontSize={18} />, text: t("wallet.service1", "跨应用统一登录") },
                { icon: <LinkOutline fontSize={18} />, text: t("wallet.service2", "跨终端无缝衔接") },
                { icon: <GlobalOutline fontSize={18} />, text: t("wallet.service3", "去中心化云服务") },
                { icon: <CheckShieldOutline fontSize={18} />, text: t("wallet.service4", "极致的安全保障") },
              ].map((item, index) => (
                <li key={index} className="flex items-center space-x-3 text-sm text-slate-300">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
