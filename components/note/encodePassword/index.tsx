"use client";
import styles from "./index.module.css";
import { Button, Input } from "antd-mobile";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { EncodePasswordType } from "@/config/constant";
import {
  CheckShieldOutline,
  LinkOutline,
  ExclamationCircleOutline,
} from "antd-mobile-icons";
import { APPInfo } from "web-dc-api";

interface EncodePasswordProps {
  type: number; // 类型，1设置，2验证
  appInfo: APPInfo;
  confirmFun: (password: string) => void;
  onForgotPassword?: () => void;
  gotoWebAuth?: () => void; // 可选的WebAuth跳转函数
}

export default function EncodePassword(props: EncodePasswordProps) {
  const { type, appInfo, confirmFun, onForgotPassword, gotoWebAuth } = props;
  const { t } = useTranslation();
  const [password, setPassword] = useState("");

  const gotoConfirm = () => {
    if (!password) {
      window.showToast({
        content: t("encode.password_empty"),
        position: "bottom",
      });
      return;
    }
    confirmFun(password);
  };

  const handleForgotPassword = () => {
    if(onForgotPassword){
      onForgotPassword();
    }
  };

  const hanldeWebAuth = () => {
    if(gotoWebAuth){
      gotoWebAuth();
    }
  };
  

  const canWebAuth = typeof window !== "undefined" && typeof window.PublicKeyCredential !== "undefined";

  return (
    <div className={styles.simplePage}>
      <div className={styles.simpleCard}>
        {/* title 快捷访问密码 */}
        { (!appInfo || !appInfo.appName ) && <div className={styles.appInfoHeader}>
          <LinkOutline className={styles.appInfoIcon} />
          <span>{t("encode.password")}</span>
        </div> }
        {/* 应用信息区域 */}
        {!!appInfo && !!appInfo.appName && (
          <div className={styles.appInfoSection}>
            <div className={styles.appInfoHeader}>
              <LinkOutline className={styles.appInfoIcon} />
              <span>{t("DAPP.info")}</span>
            </div>
            <div className={styles.appInfoContent}>
              <div className={styles.appInfoItem}>
                <span className={styles.appInfoLabel}>{t("DAPP.app")}</span>
                <span className={styles.appInfoValue}>{appInfo.appName}</span>
              </div>
              <div className={styles.appInfoItem}>
                <span className={styles.appInfoLabel}>{t("DAPP.appUrl")}</span>
                <span className={styles.appInfoValue}>{appInfo.appUrl}</span>
              </div>
              <div className={styles.appInfoItem}>
                <span className={styles.appInfoLabel}>
                  {t("DAPP.appVersion")}
                </span>
                <span className={styles.appInfoValue}>
                  {appInfo.appVersion}
                </span>
              </div>

              <div className={styles.appInfoWarning}>
                <ExclamationCircleOutline className={styles.warningIcon} />
                {t("DAPP.warning")}
              </div>
            </div>
          </div>
        )}

        {/* 密码输入区域 */}
        <div className={styles.passwordContainer}>
          {/* 明确设置输入框样式防止不可见 */}
          <div className={styles.inputWrapper}>
            <Input
              placeholder="请输入密码"
              value={password}
              onChange={setPassword}
              onEnterPress={gotoConfirm}
              clearable
              type="password"
              className={styles.passwordInput}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                width: "100%",
                background: "#f9f9f9",
                marginBottom: "10px",
              }}
            />
          </div>

          <div className={styles.note}>
            {type === EncodePasswordType.SET
              ? t("encode.set_tip")
              : t("encode.verify_tip")}
          </div>
        </div>
        {/* 忘记密码链接 */}
        {canWebAuth && <div className={styles.webauthLink} onClick={hanldeWebAuth}>
          <span className={styles.linkText}>使用WebAuth认证</span>
        </div>}

        {/* 按钮区域 */}
        <div className={styles.btnD}>
          <div className={styles.btn}>
            <Button color="primary" fill="solid" onClick={gotoConfirm} block>
              {t("common.confirm")}
            </Button>
          </div>
        </div>

        {/* 忘记密码链接 */}
        <div className={styles.forgotPassword} onClick={handleForgotPassword}>
          忘记快捷密码? <span className={styles.linkText}>重新登录</span>
        </div>

        {/* 安全提示 */}
        <div className={styles.securityNote}>
          <CheckShieldOutline className={styles.securityIcon} />
          {t("common.security_protected")}
        </div>
      </div>
    </div>
  );
}
