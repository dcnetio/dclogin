"use client";
import styles from './index.module.css'
import { useTranslation} from 'react-i18next';
interface GASTotalProps {
  amount: string | undefined;
  currencySymbol: string;
}
export default function GASTotal(props: GASTotalProps) {
  const {amount, currencySymbol} = props;
  const { t } = useTranslation();
 
  return (
    <div className={styles.info}>
      <div className={styles.titleD}>
      <div className={styles.title}>{t('transfer.total')}</div>
      <div className={styles.greyTxt}>{t('transfer.amount')} + {t('transfer.fuel_cost')}</div>
      </div>
      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.bold}>{Number(amount) * 1.0000105}{currencySymbol}</div>
          <div className={styles.txt}>{t('transfer.maximum_amount')}：{Number(amount) * 1.0000105}{currencySymbol}</div>
        </div>
      </div>
    </div>
  );
}