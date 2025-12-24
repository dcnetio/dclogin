"use client";
import { Ellipsis } from "antd-mobile";
import { useEffect } from "react";
import Card from "@/components/ui/Card";
import { AccountInfo } from '@/types/walletTypes';
interface TransItemProps {
  fromItem: AccountInfo | undefined;
  to: string;
}
export default function TransItem(props: TransItemProps) {
  const {fromItem, to} = props;
  useEffect(() => {
  }, []);
 
  return (
    <div className="flex gap-3 flex-col md:flex-row">
      <Card className="flex-1 text-center py-3">
        <Ellipsis direction="middle" content={fromItem?.account || ""} className="text-sm text-white" />
      </Card>
      <Card className="flex-1 text-center py-3">
        <Ellipsis direction="middle" content={to || ""} className="text-sm text-white" />
      </Card>
    </div>
  );
}