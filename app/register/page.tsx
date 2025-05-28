"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation} from 'react-i18next';
import { Button, Input, Toast } from "antd-mobile";
import { createAccountWithRegister } from "@/app/index";
import Link from "next/link";
interface RegisterProps {
  origin?: string;
}
export default function Register(props: {searchParams: RegisterProps}) {
    const {searchParams} = props;
    const origin = searchParams?.origin || '';

  const router = useRouter();
  const {t} = useTranslation();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
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
    // todo登录
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
        // todo 登录成功，跳转到首页
        if(res && res.success) {
          Toast.show({
            content: t('register.success'),
            position: "bottom",
          });
          // 跳转到首页
          router.push("/login?origin=" + origin);
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
    router.push("/login?origin=" + origin);
  };
  useEffect(() => {
  }, []);
  return (
    <div className={styles.content}>
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
  );
}
