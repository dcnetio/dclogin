"use client";
import { APPInfo } from "@/types/pageType";
import styles from "./index.module.css";
import { Button } from "antd-mobile";
import {CheckShieldFill} from "antd-mobile-icons";
import { useTranslation} from 'react-i18next';

interface AddDAPPNoteProps {
  info: APPInfo;
  confirmFun: () => void;
}
export default function AddDAPPNote(props: AddDAPPNoteProps) {
  const { info, confirmFun } = props;
  const {t} = useTranslation();
  return (
    <div className={styles.page}>
      <div className={styles.icon}>
        <CheckShieldFill fontSize={48}/>
      </div>
      <div className={styles.title}>{t('DAPP.add_title')}</div>
      <div className={styles.content}>
        <div className={styles.url}>{info.appUrl}</div>
        <div className={styles.name}>
        {t('DAPP.app')}{info.appName} {info.appVersion}
        </div>
      </div>
      <div className={styles.note}>{t('DAPP.add_tip')}</div>
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
          {t('DAPP.allow_add')}
          </Button>
        </div>
      </div>
    </div>
  );
}
