import React from "react";
import { X, CreditCard } from "lucide-react";
import { CurrencyType, StoragePurchaseStatus } from "@/config/constant";
import { OrderRecord } from "@/types/pageType";

interface OrderDetailProps {
  order: OrderRecord;
  onClose: () => void;
}
export default function OrderDetail({ order, onClose }: OrderDetailProps) {
  // 模拟支付信息
  const paymentInfo = {
    method: "微信支付",
    transactionId: order.orderId,
    paidAt: order.createTime,
    amount: order.amount,
  };

  // 订单时间线
  const timeline = [
    {
      status: "订单已创建",
      time: order.createTime,
      active: false,
    },
  ];
  if (order && order.status == StoragePurchaseStatus.SUCCESS) {
    timeline.push({
      status: "完成",
      time: order.updateTime,
      active: order.status === StoragePurchaseStatus.SUCCESS,
    });
  } else {
    timeline[0].active = true;
  }
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* 头部 */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-white/10 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              订单详情
            </h2>
            <p className="text-sm text-slate-400 mt-1 ml-3 font-mono">
              #{order.orderId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 订单状态卡片 */}
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex items-center gap-3 mb-4">
              <h3
                className={`text-sm font-bold px-3 py-1 rounded-full border ${
                  StoragePurchaseStatus.SUCCESS == order.status
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }`}
              >
                {StoragePurchaseStatus.SUCCESS == order.status
                  ? "已完成"
                  : "待支付"}
              </h3>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-sm">套餐名称</span>
                <span className="text-white font-medium text-right">{order.pkgName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">下单时间</span>
                <span className="text-white font-mono text-sm">{new Date(order.createTime).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* 支付信息 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              支付信息
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-slate-400">支付方式</span>
                <span className="text-white font-medium">{paymentInfo.method}</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-slate-400">支付金额</span>
                <span className="text-xl font-bold text-white">
                  {order.currency === CurrencyType.CNY ? "¥" : "$"}
                  {paymentInfo.amount
                    ? (paymentInfo.amount * 0.01).toFixed(2)
                    : 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-slate-400">交易单号</span>
                <span className="text-white font-mono text-sm text-right max-w-[200px] truncate" title={paymentInfo.transactionId}>
                  {paymentInfo.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">支付时间</span>
                <span className="text-white font-mono text-sm">
                  {new Date(paymentInfo.paidAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
