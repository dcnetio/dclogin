"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation} from 'react-i18next';
import { Button, Input, Toast } from "antd-mobile";
import { createAccountWithRegister } from "@/app/index";
import { baseUrl } from "@/config/constant";

export default function Register() {
  const searchParams = useSearchParams();
  const origin = searchParams?.get('origin') || '';
  const router = useRouter();
  const {t} = useTranslation();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(true);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const gotoConfirm = async () => {
    // 保持现有的注册逻辑不变
    if (!account) {
      Toast.show({
        content: t('register.account_empty'),
        position: "bottom",
      });
      return;
    }
    if (!password) {
      Toast.show({
        content: t('register.password_empty'),
        position: "bottom",
      });
      return;
    }
    
    // 保持现有的账户创建逻辑
    if(globalThis.dc) {
      if(!globalThis.dc.auth) {
        Toast.show({
          content: t('register.failed'),
          position: "bottom",
        });
        return;
      }
      try {
        const res = await createAccountWithRegister(account, password, "000000");
        if(res && res.success) {
          Toast.show({
            content: t('register.success'),
            position: "bottom",
          });
          router.push(baseUrl + "/login?origin=" + origin);
          return;
        }
        Toast.show({
          content: t('register.failed'),
          position: "bottom",
        });
      } catch (error) {
        console.log("accountLogin error", error);
        Toast.show({
          content: t('register.failed'),
          position: "bottom",
        });
      }
    }
  };
  
  const gotoLogin = () => {
    router.push(baseUrl + "/login?origin=" + origin);
  };
  
  return (
    <div className={styles.content}>
      {/* PC端背景区域 */}
      <div className={styles.backgroundPattern}>
        {!isMobile && (
          // 保留PC端的品牌信息和装饰元素
          <>
            <div className={styles.geoDecor1}></div>
            <div className={styles.geoDecor2}></div>
            <div className={styles.geoDecor3}></div>
            <div className={styles.circleDecor}></div>
            <div className={styles.brandInfo}>
              {/* PC端品牌信息保持不变 */}
              {/* ... */}
            </div>
          </>
        )}
      </div>
      
      {/* 注册表单区域 - 优化移动端视图 */}
      <div className={styles.registerContainer}>
        {/* Logo区域 */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
          </div>
          <h2 className={styles.title}>{t('register.register', '注册')}</h2>
          <p className={styles.subtitle}>{t('register.subtitle', '创建私人账户，开启您的Web3之旅')}</p>
          
          {/* 移动端描述 - 优化显示 */}
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
        
        {/* 表单区域 - 更好地组织结构 */}
        <div className={styles.formWrapper}>
          <div className={styles.formSection}>
            <div className={styles.inputGroup}>
              <Input
                placeholder={t('register.account')}
                value={account}
                onChange={setAccount}
                onEnterPress={gotoConfirm}
                clearable
              />
            </div>
            <div className={styles.inputGroup}>
              <Input
                placeholder={t('register.password')}
                value={password}
                onChange={setPassword}
                onEnterPress={gotoConfirm}
                clearable
                type="password"
              />
            </div>
          </div>
        </div>
        
        {/* 按钮组 - 确保在底部可见 */}
        <div className={styles.buttonGroup}>
          <Button color="primary" fill="solid" onClick={gotoConfirm} block>
            {t('register.register', '注册')}
          </Button>
        </div>
        
        {/* 登录链接 - 确保在底部可见 */}
        <div className={styles.loginPrompt} onClick={gotoLogin}>
          {t('register.have_account', '已有账户?')} 
          <span className={styles.loginLink}>{t('register.go_login', '前往登录')}</span>
        </div>
        
        {/* 底部区域 - 预留空间 */}
        <div className={styles.bottomSection}></div>
      </div>
    </div>
  );
}