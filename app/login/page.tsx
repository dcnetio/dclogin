  "use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation} from 'react-i18next';
import { Button, Input, Toast } from "antd-mobile";
import { createAccountWithLogin } from "@/app/index";
export default function Login() {
  const router = useRouter();
  const {t} = useTranslation();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [safecode, setSafecode] = useState("000000");
  const gotoConfirm = async () => {
    if (!account) {
      Toast.show({
        content: t('login.account_empty'),
        position: "bottom",
      });
      return;
    }
    if (!password) {
      Toast.show({
        content: t('login.password_empty'),
        position: "bottom",
      });
      return;
    }
    if (!safecode) {
      Toast.show({
        content: t('login.safecode_empty'),
        position: "bottom",
      });
      return;
    }
    // todo登录
    if(globalThis.dc) {
      if(!globalThis.dc.auth) {
        Toast.show({
          content: t('login.failed'),
          position: "bottom",
        });
        return;
      }
      try {
        const res = await createAccountWithLogin(account, password, safecode)
        console.log("accountLogin res", res);
        // todo 登录成功，跳转到首页
        if(res && res.success) {
          Toast.show({
            content: t('login.success'),
            position: "bottom",
          });
          // 跳转到首页
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
  useEffect(() => {
  }, []);
  return (
    <div className={styles.content}>
      <div className={styles.input}>
        <Input
          placeholder={t('login.account')}
          value={account}
          onChange={setAccount}
          onEnterPress={gotoConfirm}
          clearable
        />
      </div>
      <div className={styles.input}>
        <Input
          placeholder={t('login.password')}
          value={password}
          onChange={setPassword}
          onEnterPress={gotoConfirm}
          clearable
        />
      </div>
      <div className={styles.input}>
        <Input
          placeholder={t('login.safecode')}
          value={safecode}
          onChange={setSafecode}
          onEnterPress={gotoConfirm}
          clearable
        />
      </div>
      <div className={styles.btn}>
        <Button color="primary" fill="solid" onClick={gotoConfirm} block>
        {t('login.login')}
        </Button>
      </div>
    </div>
  );
}
