"use client";
import styles from "./index.module.css";
import { Button, Input } from "antd-mobile";
import { useTranslation} from 'react-i18next';
import { useState } from "react";
import { EncodePasswordType } from "@/config/constant";
import { LockOutlined, CheckShieldOutline, LinkOutline, ExclamationCircleOutline } from 'antd-mobile-icons';
import { useRouter } from "next/navigation";

interface EncodePasswordProps {
  type: number; // 类型，1设置，2验证
  confirmFun: (password: string) => void;
  onForgotPassword?: () => void;
}

export default function EncodePassword(props: EncodePasswordProps) {
  const { type, confirmFun, onForgotPassword } = props;
  const {t} = useTranslation();
  const [password, setPassword] = useState("");
  
  // 应用信息直接写死在组件内部
  const appInfo = {
    name: "DCAPP Name11 (DCAPP11)",
    url: "http://localhost:5173",
    version: "v0.0.1"
  };
  
  const gotoConfirm = () => {
    if (!password) {
      window.showToast({
        content: t('encode.password_empty'),
        position: "bottom",
      });
      return;
    }
    confirmFun && confirmFun(password);
  };
  
  const handleForgotPassword = () => {
    onForgotPassword && onForgotPassword();
  };
  
  return (
    <div className={styles.simplePage}>
      <div className={styles.simpleCard}>
        {/* 应用信息区域 */}
        <div className={styles.appInfoSection}>
          <div className={styles.appInfoHeader}>
            <LinkOutline className={styles.appInfoIcon} />
            <span>{t('DAPP.info')}</span>
          </div>
          <div className={styles.appInfoContent}>
            <div className={styles.appInfoItem}>
              <span className={styles.appInfoLabel}>{t('DAPP.app')}</span>
              <span className={styles.appInfoValue}>{appInfo.name}</span>
            </div>
            <div className={styles.appInfoItem}>
              <span className={styles.appInfoLabel}>{t('DAPP.appUrl')}</span>
              <span className={styles.appInfoValue}>{appInfo.url}</span>
            </div>
            <div className={styles.appInfoItem}>
              <span className={styles.appInfoLabel}>{t('DAPP.appVersion')}</span>
              <span className={styles.appInfoValue}>{appInfo.version}</span>
            </div>
            
            <div className={styles.appInfoWarning}>
              <ExclamationCircleOutline className={styles.warningIcon} />
              {t('DAPP.warning')}
            </div>
          </div>
        </div>
        
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
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '12px',
                width: '100%',
                background: '#f9f9f9',
                marginBottom: '10px',
              }}
              prefix={<LockOutlined style={{color: '#666'}} />}
            />
          </div>
          
          <div className={styles.note}>
            {type === EncodePasswordType.SET ? t('encode.set_tip') : t('encode.verify_tip')}
          </div>
        </div>
        
        {/* 按钮区域 */}
        <div className={styles.btnD}>
          <div className={styles.btn}>
            <Button color="primary" fill="solid" onClick={gotoConfirm} block>
              {t('common.confirm')}
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
          {t('common.security_protected')}
        </div>
      </div>
    </div>
  );
}