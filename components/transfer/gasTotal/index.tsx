"use client";
import { useTranslation } from "react-i18next";
import Card from "@/components/ui/Card";
interface GASTotalProps {
  amount: string | undefined;
  currencySymbol: string;
}
export default function GASTotal(props: GASTotalProps) {
  const {amount, currencySymbol} = props;
  const { t } = useTranslation();
 
  return (
    <Card className="flex items-start md:flex-row flex-col p-4">
      <div className="w-36">
        <div className="font-semibold text-white">{t("transfer.total")}</div>
        <div className="text-sm text-gray-400">{t("transfer.amount")} + {t("transfer.fuel_cost")}</div>
      </div>
      <div className="flex-1 text-right">
        <div className="text-lg font-bold text-white">{Number(amount) * 1.0000105}{currencySymbol}</div>
        <div className="text-sm text-gray-400">{t("transfer.maximum_amount")}：{Number(amount) * 1.0000105}{currencySymbol}</div>
      </div>
    </Card>
  );
}