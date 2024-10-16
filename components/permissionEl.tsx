"use client";
import { useEffect } from 'react';
import styles from './permissionEl.module.css'
import { openInfo } from '@/types/pageType';
interface PermissionElProps {
  info: openInfo
}
export default function PermissionEl(props: PermissionElProps) {
  const {info} = props;
  useEffect(() => {
  }, []);
 
  return (
    <div className={styles.info}>
      <div>应用：{info.appName} {info.appVersion} </div>
      <div>路径：{info.appUrl} </div>
      <div>请求验证，是否允许？ </div>
    </div>
  );
}