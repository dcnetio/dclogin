import React, { useCallback, useEffect, useState } from "react";
import { X, CreditCard } from "lucide-react";
import { CurrencyType, StoragePurchaseStatus } from "@/config/constant";
import { OrderRecord } from "@/types/pageType";
import { container } from "@/server/dc-contianer";
import { Button, Toast } from "antd-mobile";
import QRCode from "qrcode";
import { useTranslation } from "react-i18next";
import {
  getOrderInfoWithOrderId,
  updateOrderRecord,
} from "@/services/threadDB/orders";

interface OrderDetailProps {
  order: OrderRecord;
  onClose: () => void;
}
export default function OrderDetail({ order, onClose }: OrderDetailProps) {
  const { t } = useTranslation();
  const [orderInfo, setOrderInfo] = useState<OrderRecord>(order);
  const [isProcessing, setIsProcessing] = useState(false);

  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  const handlePay = useCallback(async () => {
    try {
      setIsProcessing(true);
      // 先判断
      const nOrderInfo = await getStoragePurchaseStatus(orderInfo.orderId);
      if (nOrderInfo && nOrderInfo.status === StoragePurchaseStatus.SUCCESS) {
        Toast.show({
          icon: "success",
          content: t("order.order_cancelled"),
          position: "center",
        });
        return;
      }
      if (nOrderInfo && nOrderInfo.status === StoragePurchaseStatus.CANCEL) {
        Toast.show({
          icon: "fail",
          content: t("order.wxpay_not_init"),
          position: "center",
        });
        return;
      }
      if (
        nOrderInfo &&
        nOrderInfo.status !== StoragePurchaseStatus.WAITING_CONFIRM
      ) {
        return;
      }
      // 支付
      const wxPayManager = container.get("wxPayManager");
      if (!wxPayManager) {
        Toast.show({
          icon: "fail",
          content: t("order.wxpay_not_init"),
          position: "center",
        });
        return [];
      }
      const [codeUrl, error] = await wxPayManager.getNativePrepay(
        orderInfo.orderId
      );
      if (error) {
        Toast.show({
          icon: "fail",
          content: error.message || t("order.get_qrcode_failed"),
          position: "center",
        });
        return [];
      }
      const url = await QRCode.toDataURL(codeUrl);
      setQrCodeUrl(url);
    } catch (error) {
    } finally {
      setIsProcessing(false);
    }
  }, [orderInfo]);

  const finishPayment = async () => {
    try {
      if (!orderInfo || !orderInfo.orderId) {
        Toast.show({
          icon: "fail",
          content: t("order.no_order_info"),
          position: "center",
        });
        return;
      }
      const nOrderInfo = await getStoragePurchaseStatus(orderInfo.orderId);

      if (nOrderInfo && nOrderInfo.status === StoragePurchaseStatus.SUCCESS) {
        Toast.show({
          icon: "success",
          content: t("order.order_cancelled"),
          position: "center",
        });
        return;
      }
      if (nOrderInfo && nOrderInfo.status === StoragePurchaseStatus.CANCEL) {
        Toast.show({
          icon: "fail",
          content: t("order.wxpay_not_init"),
          position: "center",
        });

        return;
      }
      Toast.show({
        content: t("order.order_pending"),
        position: "center",
      });
    } catch (error) {
    } finally {
      setQrCodeUrl("");
    }
  };
  const getStoragePurchaseStatus = async (
    tradeNo: string
  ): Promise<OrderRecord> => {
    const nOrderInfo = { ...orderInfo };
    try {
      const wxPayManager = container.get("wxPayManager");
      if (!wxPayManager) {
        Toast.show({
          icon: "fail",
          content: t("order.wxpay_not_init"),
          position: "center",
        });
        return nOrderInfo;
      }
      const [status, error] = await wxPayManager.getStoragePurchaseStatus(
        tradeNo
      );
      if (error) {
        Toast.show({
          icon: "fail",
          content: error.message || t("order.query_order_failed"),
          position: "center",
        });
        return nOrderInfo;
      }
      // 根据状态处理
      if (status === StoragePurchaseStatus.SUCCESS) {
        // 更新订单状态
        await updateOrderRecord({
          ...orderInfo,
          status: StoragePurchaseStatus.SUCCESS as number,
        });
        nOrderInfo.status = StoragePurchaseStatus.SUCCESS;
        setOrderInfo(nOrderInfo);
        return nOrderInfo;
      } else if (status === StoragePurchaseStatus.WAITING_CONFIRM) {
        const orderInfo = await getOrderInfoWithOrderId(tradeNo);
        if (orderInfo && orderInfo.createTime) {
          const diffTime = Date.now() - orderInfo.createTime;
          if (diffTime > 6 * 60 * 1000) {
            // 超过6分钟还是未确认
            // 取消,更新订单状态
            await updateOrderRecord({
              ...orderInfo,
              status: StoragePurchaseStatus.CANCEL as number,
            });
            nOrderInfo.status = StoragePurchaseStatus.CANCEL;
            setOrderInfo(nOrderInfo);
            return nOrderInfo;
          }
        }
      }
    } catch (error) {
      console.error("查询订单出错:", error);
    } finally {
      return nOrderInfo;
    }
  };

  useEffect(() => {
    if (order) {
      getStoragePurchaseStatus(order.orderId);
    }
  }, [order]);
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* 头部 */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-white/10 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
              {t("order.order_detail")}
            </h2>
            <p className="text-sm text-slate-400 mt-1 ml-3 font-mono">
              #{orderInfo.orderId}
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
                  StoragePurchaseStatus.SUCCESS == orderInfo.status
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : StoragePurchaseStatus.CANCEL == orderInfo.status
                    ? "bg-red-500/10 text-red-400 border-red-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                }`}
              >
                {StoragePurchaseStatus.SUCCESS == orderInfo.status
                  ? StoragePurchaseStatus.SUCCESS_DESC
                  : StoragePurchaseStatus.CANCEL == orderInfo.status
                  ? StoragePurchaseStatus.CANCEL_DESC
                  : StoragePurchaseStatus.WAITING_CONFIRM_DESC}
              </h3>
            </div>
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between items-start">
                <span className="text-slate-400 text-sm">
                  {t("order.package_name")}
                </span>
                <span className="text-white font-medium text-right">
                  {orderInfo.pkgName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">
                  {t("order.order_time")}
                </span>
                <span className="text-white font-mono text-sm">
                  {new Date(orderInfo.createTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 支付信息 */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              {t("order.payment_info")}
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-slate-400">
                  {t("order.payment_method")}
                </span>
                <span className="text-white font-medium">
                  {t("order.wechat_pay")}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-slate-400">
                  {t("order.payment_amount")}
                </span>
                <span className="text-xl font-bold text-white">
                  {orderInfo.currency === CurrencyType.CNY ? "¥" : "$"}
                  {orderInfo.amount ? (orderInfo.amount * 0.01).toFixed(2) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <span className="text-slate-400">
                  {t("order.transaction_id")}
                </span>
                <span
                  className="text-white font-mono text-sm text-right max-w-[200px] truncate"
                  title={orderInfo.orderId}
                >
                  {orderInfo.orderId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">
                  {t("order.payment_time")}
                </span>
                <span className="text-white font-mono text-sm">
                  {new Date(orderInfo.createTime).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 支付按钮 */}
          {orderInfo.status === StoragePurchaseStatus.WAITING_CONFIRM && (
            <div className="flex justify-center">
              <button
                disabled={isProcessing}
                onClick={handlePay}
                className="flex bg-primary text-white px-8 py-2 rounded-xl hover:bg-primary/90 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("order.processing")}
                  </>
                ) : (
                  t("order.pay")
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {qrCodeUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-auto max-w-4xl max-h-[90vh]  flex flex-col bg-slate-900 border border-white/10 rounded-2xl shadow-2xl">
            <div className="flex justify-end">
              <button
                onClick={() => setQrCodeUrl("")}
                className="m-4 p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex flex-col mb-8 px-16 py-8 items-center justify-center">
              <p className="text-gray-300 mb-2">
                {t("order.package_name")}：{orderInfo?.pkgName}
              </p>
              <h2 className="text-2xl font-bold mb-6 text-white">
                {t("order.scan_to_pay")}
              </h2>
              <div className="bg-white p-4 rounded-xl mb-8">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48 lg:w-64 lg:h-64"
                />
              </div>
              <Button
                onClick={finishPayment}
                className="py-3 w-full max-w-xs font-bold"
                variant="primary"
              >
                {t("order.payment_completed")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
