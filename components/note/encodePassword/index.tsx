"use client";
import styles from "./index.module.css";
import { Button, Input, Toast } from "antd-mobile";
import { useTranslation} from 'react-i18next';
import { useState } from "react";
import { EncodePasswordType } from "@/config/constant";

interface EncodePasswordProps {
  type: number; // 类型，1设置，2验证
  confirmFun: (password: string) => void;
}
export default function EncodePassword(props: EncodePasswordProps) {
  const { type, confirmFun } = props;
  const {t} = useTranslation();
  const [password, setPassword] = useState("");
  const gotoConfirm = () => {
    if (!password) {
      Toast.show({
        content: t('encode.password_empty'),
        position: "bottom",
      });
      return;
    }
    // todo判断是否正确

    confirmFun && confirmFun(password);
  };
  return (
    <div className={styles.page}>
      <div className={styles.title}>{t('encode.password')}</div>
      <div className={styles.input}>
        <Input
          placeholder={t('login.password')}
          value={password}
          onChange={setPassword}
          onEnterPress={gotoConfirm}
          clearable
        />
      </div>
      <div className={styles.note}>
        {type === EncodePasswordType.SET ? t('encode.set_tip') : t('encode.verify_tip')}
      </div>
      <div className={styles.btnD}>
        <div className={styles.btn}>
          <Button color="primary" fill="solid" onClick={gotoConfirm} block>
            {t('common.confirm')}
          </Button>
        </div>
      </div>
    </div>
  );
}
