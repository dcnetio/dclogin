"use client";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation} from 'react-i18next';
import { Button, Input, Toast } from "antd-mobile";
import { accountBindNFTAccount, createAccountWithRegister } from "@/app/index";
interface RegisterProps {
  bind: boolean;
}
export default function Register(props: RegisterProps) {
  const {bind, mnemonic} = props;
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
        if(bind) {
          // 绑定nft账号
          const bindRes = await accountBindNFTAccount(account, password, "000000", mnemonic);
          // todo bind成功，跳转到首页
          if(bindRes && bindRes.success) {
            Toast.show({
              content: t('bind.success'),
              position: "bottom",
            });
            // 跳转到首页
            router.push("/");
            return;
          }
          Toast.show({
            content: t('bind.failed'),
            position: "bottom",
          });
          return;
        }
        const res = await createAccountWithRegister(account, password, "000000");
        // todo 登录成功，跳转到首页
        if(res && res.success) {
          Toast.show({
            content: t('register.success'),
            position: "bottom",
          });
          // 跳转到首页
          router.push("/");
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
    </div>
  );
}
