"use client";
import { getCurrentAccount } from "@/app";
import styles from "./index.module.css";
import { Button } from "antd-mobile";
import { CheckShieldFill } from "antd-mobile-icons";
import { useEffect, useState } from "react";
import { useTranslation} from 'react-i18next';
interface SignatureDAPPNoteProps {
  appUrl: string;
  msg: string | object;
  confirmFun: () => void;
}
export default function SignatureDAPPNote(props: SignatureDAPPNoteProps) {
  const { appUrl, msg, confirmFun } = props;
  const {t} = useTranslation();
  const [account, setAccount] = useState("");
  useEffect(() => {
    const info = getCurrentAccount();
    if (info?.account) {
      setAccount(info.account);
    }
  }, []);
  return (
    <div className={styles.page}>
      <div className={styles.icon}>
        <CheckShieldFill fontSize={48} />
      </div>
      <div className={styles.title}>{t('sign.sign_title')}</div>
      <div className={styles.content}>
        <div>
        {t('sign.sign_tip0')}<div className={styles.url}>{appUrl}</div>{t('sign.sign_tip1')}
        </div>
        <div className={styles.name}>{t('sign.sign_account')}{account}</div>
        <div className={styles.name}>{t('sign.sign_msg')}{JSON.stringify(msg)}</div>
      </div>
      <div className={styles.note}>{t('sign.sign_tip')}</div>
      <div className={styles.btnD}>
        <div className={styles.btn}>
          <Button
            color="primary"
            fill="outline"
            onClick={() => {
              window.close();
            }}
            block
          >
            {t('common.cancel')}
          </Button>
        </div>
        <div className={styles.btn}>
          <Button color="primary" fill="solid" onClick={confirmFun} block>
          {t('sign.allow_sign')}
          </Button>
        </div>
      </div>
    </div>
  );
}
