"use client";
import styles from './index.module.css'
import { useTranslation} from 'react-i18next';
interface GASItemProps {
  amount: string | undefined;
  currencySymbol: string;
}
export default function GASItem(props: GASItemProps) {
  const {amount, currencySymbol} = props;
  const { t } = useTranslation();
 
  return (
    <div className={styles.info}>
      <div className={styles.title}>{t('transfer.estimated_cost')}</div>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.bold}>0.00</div>
          <div className={styles.txt}>{Number(amount) * 0.0000105}{currencySymbol}</div>
          <div className={styles.txt}>{t('transfer.maximum_cost')}：{Number(amount) * 0.0000105}{currencySymbol}</div>
        </div>
      </div>
    </div>
  );
}