"use client";
import { Ellipsis } from "antd-mobile";
import Card from "@/components/ui/Card";
import { AccountInfo } from '@/types/walletTypes';
import { useTranslation} from 'react-i18next';
interface TransAccountProps {
  accountInfo: AccountInfo | undefined;
  balance: string;
  currencySymbol: string;
}
export default function TransAccount(props: TransAccountProps) {
  const {accountInfo, balance, currencySymbol} = props;
  const {t} = useTranslation();
 
  return (
    <Card className="p-4">
      <div className="text-lg font-semibold text-white">{accountInfo?.name}</div>
      <Ellipsis
        direction="middle"
        content={accountInfo?.nftAccount || ""}
        className="text-sm text-gray-300 break-words mt-2"
      />
      <div className="mt-3 text-sm text-gray-400">{t("transfer.current_amount")}：{balance} {currencySymbol}</div>
    </Card>
  );
}