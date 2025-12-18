import React from "react";
import {
  X,
  Package,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  CheckCircle,
} from "lucide-react";
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* 头部 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">订单详情</h2>
            <p className="text-sm text-gray-500 mt-1">
              订单号: {order.orderId}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* 订单状态卡片 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <h3
                className={`text-lg font-bold ${
                  StoragePurchaseStatus.SUCCESS == order.status
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {StoragePurchaseStatus.SUCCESS == order.status
                  ? "已完成"
                  : "待支付"}
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-2 text-ellipsis overflow-hidden">
              套餐名称: {order.pkgName}
            </p>
            <p className="text-gray-600 text-sm">
              下单时间: {new Date(order.createTime).toLocaleString()}
            </p>
          </div>

          {/* 支付信息 */}
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              支付信息
            </h3>
            <div className="space-y-2 ">
              <div className="flex">
                <span className="text-gray-600 mr-4">支付方式:</span>
                <span className="text-gray-900">{paymentInfo.method}</span>
              </div>
              <div className="flex">
                <span className="text-gray-600 mr-4">支付金额:</span>
                <span className="text-gray-900">
                  {order.currency === CurrencyType.CNY ? "¥" : "$"}
                  {paymentInfo.amount
                    ? (paymentInfo.amount * 0.01).toFixed(2)
                    : 0}
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-600 mr-4">交易单号:</span>
                <span className="text-gray-900 flex-1 font-mono text-sm text-ellipsis overflow-hidden">
                  {paymentInfo.transactionId}
                </span>
              </div>
              <div className="flex">
                <span className="text-gray-600 mr-4">支付时间:</span>
                <span className="text-gray-900">
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
