"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation} from 'react-i18next';
import { Button, Input, Toast } from "antd-mobile";
import { createAccountWithRegister } from "@/app/index";
import Link from "next/link";
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
      
      <div className={styles.registerContainer}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}></div>
          </div>
          <h2 className={styles.title}>{t('register.register')}</h2>
          <p className={styles.subtitle}>{t('register.subtitle', '创建跨应用账户，开启您的Web3之旅')}</p>
        </div>
        
        <div className={styles.formSection}>
          <div className={styles.input}>
            <Input
              placeholder={t('register.account')}
              value={account}
              onChange={setAccount}
              onEnterPress={gotoConfirm}
              clearable
            />
          </div>
          <div className={styles.input}>
            <Input
              placeholder={t('register.password')}
              value={password}
              onChange={setPassword}
              onEnterPress={gotoConfirm}
              clearable
              type="password"
            />
          </div>
          
          <div className={styles.btn}>
            <Button color="primary" fill="solid" onClick={gotoConfirm} block>
              {t('register.register')}
            </Button>
          </div>
          <div className={styles.btn}>
            <Button color="default" fill="solid" onClick={gotoLogin} block>
              {t('register.go_login')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}