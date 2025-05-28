"use client";
import React from "react";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation} from 'react-i18next';
import { Button, Input, Toast } from "antd-mobile";
import { createAccountWithLogin } from "@/app/index";
import Link from "next/link";
import { baseUrl } from "@/config/constant";

interface LoginProps {
  origin?: string;
}

export default function Login() {
  const searchParams = useSearchParams();
  const origin = searchParams?.get('origin') || '';
  const router = useRouter();
  const {t} = useTranslation();
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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const gotoConfirm = async () => {
    // 登录逻辑保持不变
    if (!account) {
      Toast.show({
        content: t('login.account_empty'),
        position: "bottom",
      });
      return;
    }
    if(globalThis.dc) {
      if(!globalThis.dc.auth) {
        Toast.show({
          content: t('login.failed'),
          position: "bottom",
        });
        return;
      }
      try {
        const res = await createAccountWithLogin(account, password, safecode, origin)
        console.log("accountLogin res", res);
        if(res && res.success) {
          Toast.show({
            content: t('login.success'),
            position: "bottom",
          });
          router.push("/");
          return;
        }
        Toast.show({
          content: t('login.failed'),
          position: "bottom",
        });
      } catch (error) {
        console.log("accountLogin error", error);
        Toast.show({
          content: t('login.failed'),
          position: "bottom",
        });
      }
    }
  };
  
  const gotoRegister = () => {
    router.push(baseUrl + `/register?origin=${origin}`);
  }
  
  const toggleSafecode = () => {
    setShowSafecode(!showSafecode);
  }
  
 return (
  <div className={styles.content}>
    <div className={styles.backgroundPattern}>
      {!isMobile && (
        <>
          {/* Desktop view content remains the same */}
          <div className={styles.geoDecor1}></div>
          <div className={styles.geoDecor2}></div>
          <div className={styles.geoDecor3}></div>
          <div className={styles.circleDecor}></div>
          
          <div className={styles.brandInfo}>
            <div className={styles.brandLogo}>
              <div className={styles.logoIcon}></div>
            </div>
            <h1 className={styles.brandTitle}>{t('wallet.name', 'DCWallet')}</h1>
            <p className={styles.brandTagline}>
              {t('wallet.tagline', '您通往新一代互联网的安全入口')}
            </p>
            
            <div className={styles.brandDescription}>
              {t('wallet.description', '我们的目标是消除用户进入 Web3 的门槛，您无需再记忆复杂的助记词和私钥，即可轻松探索 Web3 世界。通过一个账号，您将掌控自己的所有数据，畅享所有基于去中心化云服务（DC）网络的 Web3 应用。让我们一起开启无缝、安全的数字体验！')}
            </div>
            
            <div className={styles.brandFeatures}>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span>{t('wallet.feature1', 'Web3快速登录')}</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span>{t('wallet.feature2', '数据资产安全')}</span>
              </div>
              <div className={styles.featureItem}>
                <span className={styles.featureIcon}>✓</span>
                <span>{t('wallet.feature3', '无缝Web3体验')}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
    
    <div className={styles.loginContainer}>
      <div className={styles.logoSection}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}></div>
        </div>
        <h1 className={styles.title}>{t('login.title', '欢迎回来')}</h1>
        <p className={styles.subtitle}>{t('login.subtitle', '登录您的DCWallet账户')}</p>
       
        {/* Add mobile description here */}
        {isMobile && (
          <div className={styles.mobileDescription}>
            {t('wallet.mobile_description', '无需记忆助记词和私钥，一个账号掌控个人所以数据，畅游Web3应用。')}
          </div>
        )}
      </div>
        <div className={styles.formSection}>
          <div className={styles.inputGroup}>
            <Input
              placeholder={t('login.account')}
              value={account}
              onChange={setAccount}
              onEnterPress={gotoConfirm}
              clearable
            />
          </div>
          <div className={styles.inputGroup}>
            <Input
              placeholder={t('login.password')}
              value={password}
              onChange={setPassword}
              onEnterPress={gotoConfirm}
              clearable
              type="password"
            />
          </div>
          
          {/* 安全码区域：默认折叠 */}
          <div className={styles.safecodeSection}>
            {showSafecode ? (
              <div className={styles.inputGroup}>
                <Input
                  placeholder={t('login.safecode')}
                  value={safecode}
                  onChange={setSafecode}
                  onEnterPress={gotoConfirm}
                  clearable
                />
              </div>
            ) : (
              <div className={styles.safecodeToggle} onClick={toggleSafecode}>
                {t('login.input_safecode', '输入安全码')}
              </div>
            )}
          </div>
          
          <div className={styles.buttonGroup}>
            <Button color="primary" fill="solid" onClick={gotoConfirm} block>
              {t('login.login')}
            </Button>
            <Button color="default" fill="outline" onClick={gotoRegister} block>
              {t('login.go_register')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}