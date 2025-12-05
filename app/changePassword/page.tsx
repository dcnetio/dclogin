"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, Input } from "antd-mobile";
import { getDC } from "@/components/auth/login/dc";
import { changePassword, getCurrentAccount } from "@/services/account";
import { AccountInfo } from "@/types/walletTypes";
import { appState } from "@/config/constant";
import { useAppSelector } from "@/lib/hooks";

export default function ChangePassword() {
  const router = useRouter();
  const { t } = useTranslation();
  const initState = useAppSelector((state) => state.app.initState);
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [safecode, setSafecode] = useState("000000");
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

  useEffect(() => {
    if (initState == appState.init_success) {
      const accountInfo = getCurrentAccount();
      if (accountInfo && accountInfo.nftAccount) {
        setAccountInfo(accountInfo);
      }
    }
  }, [initState]);

  const handleChangePassword = async () => {
    // 设置加载状态
    setIsLoading(true);

    try {
      // 检查新密码是否为空
      if (!newPassword) {
        window.showToast({
          content: t("changePassword.new_password_empty", "请输入新密码"),
          position: "bottom",
        });
        setIsLoading(false);
        return;
      }

      // 检查密码长度
      if (newPassword.length < 2) {
        window.showToast({
          content: t("changePassword.password_length", "密码长度至少2位"),
          position: "bottom",
        });
        setIsLoading(false);
        return;
      }

      // 检查确认密码是否输入
      if (!confirmPassword) {
        window.showToast({
          content: t(
            "changePassword.confirm_password_empty",
            "请确认您的新密码"
          ),
          position: "bottom",
        });
        setIsLoading(false);
        return;
      }

      // 确认两次输入的新密码是否匹配
      if (newPassword !== confirmPassword) {
        window.showToast({
          content: t(
            "changePassword.passwords_not_match",
            "两次输入的新密码不一致"
          ),
          position: "bottom",
        });
        setPasswordsMatch(false);
        setIsLoading(false);
        return;
      }

      // 获取DC实例并检查auth是否存在
      const dc = getDC();
      if (!dc || !dc.auth) {
        window.showToast({
          content: t("changePassword.failed", "修改密码失败"),
          position: "bottom",
        });
        setIsLoading(false);
        return;
      }

      // 调用修改密码接口（这里需要您实现具体的修改密码逻辑）
      const [success, error] = await changePassword(
        accountInfo,
        newPassword,
        safecode
      );

      if (error || !success) {
        console.log("Change password error", error);
        window.showToast({
          content: error.message || t("changePassword.failed", "密码修改失败"),
          position: "bottom",
        });
        return;
      }

      window.showToast({
        content: t("changePassword.success", "密码修改成功"),
        position: "bottom",
      });
      // 返回上一页或者跳转到登录页
      router.push("/");
    } catch {
      window.showToast({
        content: t("changePassword.failed", "密码修改失败"),
        position: "bottom",
      });
    } finally {
      // 无论成功与否，都重置加载状态
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  const toggleSafecode = () => {
    setShowSafecode(!showSafecode);
  };
  return (
    <div className={styles.content}>
      {/* 背景区域 - 只在PC端显示 */}
      <div className={styles.backgroundPattern}>
        {!isMobile && (
          <>
            {/* 装饰元素 */}
            <div className={styles.geoDecor1}></div>
            <div className={styles.geoDecor2}></div>
            <div className={styles.geoDecor3}></div>
            <div className={styles.circleDecor}></div>

            {/* 品牌信息 */}
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

      {/* 修改密码表单容器 */}
      <div className={styles.changePasswordContainer}>
        {/* Logo区域 */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
          </div>
          <h2 className={styles.title}>
            {t("changePassword.change_password", "修改密码")}
          </h2>
          <p className={styles.subtitle}>
            {t("changePassword.subtitle", "为您的账户设置新的登录密码")}
          </p>

          {/* 移动端描述 */}
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

        {/* 表单区域 */}
        <div className={styles.formWrapper}>
          <div className={styles.formSection}>
            <div className={`${styles.inputGroup} ${styles.accountInput}`}>
              <Input value={accountInfo?.nftAccount} disabled />
            </div>

            <div className={`${styles.inputGroup} ${styles.passwordInput}`}>
              <Input
                id="newPasswordInput"
                placeholder={t("changePassword.new_password", "新密码")}
                value={newPassword}
                onChange={(val) => {
                  setNewPassword(val);
                  // 当密码更改时，重置密码匹配状态
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
              />
            </div>

            {/* 密码确认输入框 */}
            <div className={`${styles.inputGroup} ${styles.passwordInput}`}>
              <Input
                id="confirmPasswordInput"
                placeholder={t(
                  "changePassword.confirm_password_placeholder",
                  "请再次输入新密码"
                )}
                value={confirmPassword}
                onChange={(val) => {
                  setConfirmPassword(val);
                  setPasswordsMatch(val === newPassword);
                }}
                onEnterPress={handleChangePassword}
                clearable
                type="password"
              />

              {/* 密码不匹配时显示错误提示 */}
              {confirmPassword.length > 0 && !passwordsMatch && (
                <div className={styles.passwordError}>
                  {t(
                    "changePassword.passwords_not_match",
                    "两次输入的新密码不一致"
                  )}
                </div>
              )}
            </div>
          </div>
          {/* 安全码区域不变 */}
          <div className={styles.safecodeSection}>
            {showSafecode ? (
              <div className={`${styles.inputGroup} ${styles.safecodeInput}`}>
                <Input
                  placeholder={t("login.safecode")}
                  value={safecode}
                  onChange={setSafecode}
                  onEnterPress={handleChangePassword}
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

        {/* 按钮组 */}
        <div className={styles.buttonGroup}>
          <Button
            color="primary"
            fill="solid"
            onClick={handleChangePassword}
            block
            loading={isLoading}
            loadingText={t("changePassword.changing", "修改中...")}
          >
            {t("changePassword.change_password", "修改密码")}
          </Button>
        </div>

        {/* 返回链接 */}
        <div className={styles.backPrompt} onClick={goBack}>
          {t("changePassword.back", "返回")}
        </div>

        {/* 底部区域 */}
        <div className={styles.bottomSection}></div>
      </div>
    </div>
  );
}
