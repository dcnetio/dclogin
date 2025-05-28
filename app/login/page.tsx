"use client";
import React from "react";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, Input, Toast } from "antd-mobile";
import { createAccountWithLogin } from "@/app/index";
import Link from "next/link";
import { baseUrl } from "@/config/constant";

export default function Login() {
  // 保持现有的 state 和 hooks
  const searchParams = useSearchParams();
  const origin = searchParams?.get("origin") || "";
  const router = useRouter();
  const { t } = useTranslation();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [safecode, setSafecode] = useState("000000");
  const [isMobile, setIsMobile] = useState(true);
  const [showSafecode, setShowSafecode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const gotoConfirm = async () => {
    // 登录逻辑保持不变
    if (!account) {
      Toast.show({
        content: t("login.account_empty"),
        position: "bottom",
      });
      return;
    }
    if (globalThis.dc) {
      if (!globalThis.dc.auth) {
        Toast.show({
          content: t("login.failed"),
          position: "bottom",
        });
        return;
      }
      try {
        const res = await createAccountWithLogin(
          account,
          password,
          safecode,
          origin
        );
        console.log("accountLogin res", res);
        if (res && res.success) {
          Toast.show({
            content: t("login.success"),
            position: "bottom",
          });
          router.push("/");
          return;
        }
        Toast.show({
          content: t("login.failed"),
          position: "bottom",
        });
      } catch (error) {
        console.log("accountLogin error", error);
        Toast.show({
          content: t("login.failed"),
          position: "bottom",
        });
      }
    }
  };

  const gotoRegister = () => {
    router.push(baseUrl + `/register?origin=${origin}`);
  };

  const toggleSafecode = () => {
    setShowSafecode(!showSafecode);
  };
return (
  <div className={styles.content}>
    {!isMobile && (
      // PC端视图保持不变
      <div className={styles.backgroundPattern}>
        {/* 保持现有的PC端代码不变 */}
      </div>
    )}
    
    <div className={styles.loginContainer}>
      {/* Logo区域 */}
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
        </div>
        <h1 className={styles.title}>{t("login.title", "DCWallet")}</h1>
        <p className={styles.subtitle}>
          {t("login.subtitle", "您正在使用去中心化统一登录")}
        </p>

        {/* 移动端描述 - 仅在移动端显示 */}
        {isMobile && (
          <div className={styles.mobileDescription}>
            <p className={styles.mobileIntro}>
              {t('wallet.mobile_intro_short', 'DCWallet: 安全、私密的去中心化统一登录工具')}
            </p>
            
            <div className={styles.mobileFeatures}>
              <div className={styles.mobileFeatureItem}>
                <span className={styles.mobileFeatureIcon}>✓</span>
                <span>{t('wallet.feature1', '统一登录')}</span>
              </div>
              <div className={styles.mobileFeatureItem}>
                <span className={styles.mobileFeatureIcon}>✓</span>
                <span>{t('wallet.feature2', '数据安全')}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 表单区域 */}
      <div className={styles.formWrapper}>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <Input
              placeholder={t("login.account")}
              value={account}
              onChange={setAccount}
              onEnterPress={gotoConfirm}
              clearable
            />
          </div>
          
          <div className={styles.inputGroup}>
            <Input
              placeholder={t("login.password")}
              value={password}
              onChange={setPassword}
              onEnterPress={gotoConfirm}
              clearable
              type="password"
            />
          </div>

          {/* 安全码区域 */}
          <div className={styles.safecodeSection}>
            {showSafecode ? (
              <div className={styles.inputGroup}>
                <Input
                  placeholder={t("login.safecode")}
                  value={safecode}
                  onChange={setSafecode}
                  onEnterPress={gotoConfirm}
                  clearable
                />
              </div>
            ) : (
              <div className={styles.safecodeToggle} onClick={toggleSafecode}>
                 {t("login.input_safecode", "输入安全码")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 按钮区域 - 移到容器底部 */}
      <div className={styles.buttonGroup}>
        <Button color="primary" fill="solid" onClick={gotoConfirm} block>
          {t("login.login", "登录")}
        </Button>
      </div>

      {/* 注册提示 - 确保可见 */}
      <div className={styles.registerPrompt} onClick={gotoRegister}>
        {t("login.no_account", "没有账户?")}
        <span className={styles.registerLink}>
          {t("login.register_now", "立即注册")}
        </span>
      </div>

      {/* 底部区域 */}
      <div className={styles.bottomSection}></div>
    </div>
  </div>
);
}