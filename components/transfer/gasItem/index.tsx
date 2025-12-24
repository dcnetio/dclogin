"use client";
import { useTranslation } from "react-i18next";
import Card from "@/components/ui/Card";
interface GASItemProps {
  amount: string | undefined;
  currencySymbol: string;
}
export default function GASItem(props: GASItemProps) {
  const {amount, currencySymbol} = props;
  const { t } = useTranslation();
 
  return (
    <Card className="flex items-start justify-between md:flex-row flex-col p-4">
      <div className="w-36 font-semibold text-white">{t("transfer.estimated_cost")}</div>
      <div className="flex-1 text-right">
        <div className="text-lg font-bold text-white">0.00</div>
        <div className="text-sm text-gray-300">{Number(amount) * 0.0000105}{currencySymbol}</div>
        <div className="text-sm text-gray-400">{t("transfer.maximum_cost")}：{Number(amount) * 0.0000105}{currencySymbol}</div>
      </div>
    </Card>
  );
}