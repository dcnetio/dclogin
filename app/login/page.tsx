"use client";
import React from "react";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, Input } from "antd-mobile";
import { createAccountWithLogin } from "@/app/index";
import { getDC } from "@/components/auth/login/dc";
import { store } from "@/lib/store";
import { saveInitState } from "@/lib/slices/appSlice";
import { appState } from "@/config/constant";

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
    // Set loading state to true when login starts
    setIsLoading(true);

    // Validate input
    if (!account) {
      window.showToast({
        content: t("login.account_empty"),
        position: "center",
      });
      setIsLoading(false); // Reset loading state
      return;
    }
    const dc = getDC();
    if (dc) {
      if (!dc.auth) {
        window.showToast({
          content: t("login.failed"),
          position: "center",
        });
        setIsLoading(false); // Reset loading state
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

        // Reset loading state after login completes
        setIsLoading(false);

        if (res && res.success) {
          window.showToast({
            content: t("login.success"),
            position: "center",
          });

          store.dispatch(saveInitState(appState.init_success));
          router.push("/");
          return;
        }

        window.showToast({
          content: t("login.failed"),
          position: "center",
        });
      } catch (error) {
        // Reset loading state if there's an error
        setIsLoading(false);

        console.log("accountLogin error", error);
        window.showToast({
          content: t("login.failed"),
          position: "center",
        });
      }
    } else {
      setIsLoading(false); // Reset loading if dc is not available
    }
  };

  const gotoRegister = () => {
    router.push(`/register${window.location.search}`);
  };

  const toggleSafecode = () => {
    setShowSafecode(!showSafecode);
  };
  return (
    <div className={styles.content}>
      <div className={styles.backgroundPattern}>
        {!isMobile && (
          <>
            {/* PC端视图内容 */}
            <div className={styles.geoDecor1}></div>
            <div className={styles.geoDecor2}></div>
            <div className={styles.geoDecor3}></div>
            <div className={styles.circleDecor}></div>
            <div className={styles.brandInfo}>
              <div className={styles.brandLogo}>
                <div className={styles.logoIcon}></div>
              </div>
              <h1 className={styles.brandTitle}>
                {t("wallet.name", "DCWallet")}
              </h1>
              <p className={styles.brandTagline}>
                {t("wallet.tagline", "您通往新一代互联网的安全入口")}
              </p>

              <div className={styles.brandDescription}>
                <p className={styles.descriptionIntro}>
                  {t(
                    "wallet.intro",
                    "DCWallet 是一款基于去中心化云服务（DC）开发的统一登录工具，为用户提供安全的入口，便捷地进入新一代互联网。DCWallet 不存储任何用户隐私信息。"
                  )}
                </p>

                <div className={styles.serviceSection}>
                  <h3 className={styles.sectionTitle}>
                    {t("wallet.services_title", "DCWallet 提供的服务")}
                  </h3>
                  <ul className={styles.serviceList}>
                    <li>
                      <span className={styles.checkIcon}>✓</span>{" "}
                      {t("wallet.service1", "跨应用统一登录服务")}
                    </li>
                    <li>
                      <span className={styles.checkIcon}>✓</span>{" "}
                      {t("wallet.service2", "跨终端登录服务")}
                    </li>
                    <li>
                      <span className={styles.checkIcon}>✓</span>{" "}
                      {t("wallet.service3", "去中心化云服务购买")}
                    </li>
                  </ul>
                </div>

                <div className={styles.limitationSection}>
                  <h3 className={styles.sectionTitle}>
                    {t(
                      "wallet.limitations_title",
                      "由于去中心化特性，DCWallet 无法提供"
                    )}
                  </h3>
                  <ul className={styles.limitationList}>
                    <li>
                      <span className={styles.xIcon}>×</span>{" "}
                      {t("wallet.limitation1", "用户账号和密码找回服务")}
                    </li>
                    <li>
                      <span className={styles.xIcon}>×</span>{" "}
                      {t("wallet.limitation2", "用户密码重置服务")}
                    </li>
                  </ul>
                </div>

                <div className={styles.openSourceSection}>
                  <a
                    href="https://dcnetio.github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.githubLink}
                  >
                    <svg
                      className={styles.githubIcon}
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                    >
                      <path
                        fill="currentColor"
                        d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                      />
                    </svg>
                    {t("wallet.github_link", "DCWallet 开源地址")}
                  </a>
                </div>
              </div>

              <div className={styles.brandFeatures}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>{t("wallet.feature1", "统一登录")}</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>{t("wallet.feature2", "数据安全")}</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>{t("wallet.feature3", "无缝体验")}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
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
                {t(
                  "wallet.mobile_intro_short",
                  "DCWallet: 安全、私密的去中心化统一登录工具"
                )}
              </p>

              <div className={styles.mobileFeatures}>
                <div className={styles.mobileFeatureItem}>
                  <span className={styles.mobileFeatureIcon}>✓</span>
                  <span>{t("wallet.feature1", "统一登录")}</span>
                </div>
                <div className={styles.mobileFeatureItem}>
                  <span className={styles.mobileFeatureIcon}>✓</span>
                  <span>{t("wallet.feature2", "数据安全")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 表单区域 - 更新类名 */}
        <div className={styles.formWrapper}>
          <div className={styles.formSection}>
            <div className={`${styles.inputGroup} ${styles.accountInput}`}>
              <Input
                placeholder={t("login.account")}
                value={account}
                onChange={setAccount}
                onEnterPress={gotoConfirm}
                clearable
                className={styles.inputField}
              />
            </div>

            <div className={`${styles.inputGroup} ${styles.passwordInput}`}>
              <Input
                placeholder={t("login.password")}
                value={password}
                onChange={setPassword}
                onEnterPress={gotoConfirm}
                clearable
                type="password"
                className={styles.inputField}
              />
            </div>

            {/* 安全码区域不变 */}
            <div className={styles.safecodeSection}>
              {showSafecode ? (
                <div className={`${styles.inputGroup} ${styles.safecodeInput}`}>
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
          <Button
            color="primary"
            fill="solid"
            onClick={gotoConfirm}
            block
            className={styles.loginButton}
            loading={isLoading}
            loadingText={t("login.logging_in", "登录中...")}
          >
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
