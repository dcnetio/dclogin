import {
  appState,
  CurrencyType,
  MsgStatus,
  PackageLang,
  PackageType,
  StoragePurchaseStatus,
} from "@/config/constant";
import { dcConfig } from "@/config/define";
import { useAppSelector } from "@/lib/hooks";
import i18n from "@/locales/i18n";
import { container } from "@/server/dc-contianer";
import { PackageInfo } from "@/server/wxPay/interface";
import { AccountInfo } from "@/types/walletTypes";
import { Toast } from "antd-mobile";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { login } from "@/services/account";
import { useTranslation } from "react-i18next";
import { store } from "@/lib/store";
import { updateAuthStep } from "@/lib/slices/authSlice";
import { saveInitState } from "@/lib/slices/appSlice";
import {
  addOrderRecord,
  getOrderInfoWithOrderId,
  updateOrderRecord,
} from "@/services/threadDB/orders";
import { OrderRecord } from "@/types/pageType";
import QRCode from "qrcode";
import dayjs from "dayjs";

interface StorageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // userPoints: number;
}

const StorageSubscriptionModal: React.FC<StorageSubscriptionModalProps> = ({
  isOpen,
  onClose,
  // userPoints,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  // 存储套餐数据
  const [storagePlans, setStoragePlans] = useState<PackageInfo[]>([]);

  const [selectedPlan, setSelectedPlan] = useState<PackageInfo | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("wechat");
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [orderInfo, setOrderInfo] = useState<OrderRecord>(null);

  const account: AccountInfo = useAppSelector((state) => state.wallet.account);
  const authInfo = useAppSelector((state) => state.auth.authInfo);

  useEffect(() => {
    if (isOpen) {
      getPackagesList();
      setStep(1);
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleSelectPlan = (plan: PackageInfo) => {
    setSelectedPlan(plan);
  };

  const backStep = () => {
    setStep(1);
  };

  const nextStep = () => {
    if (!account || !account.nftAccount) {
      Toast.show({
        content: t("order.please_login"),
        position: "center",
      });
      return;
    }
    if (selectedPlan) {
      setStep(2);
    } else {
      Toast.show({
        content: t("order.select_package"),
        position: "center",
      });
    }
  };

  const gotoLogin = async () => {
    try {
      // 登录逻辑
      const [user, error] = await login();
      if (error) {
        // 提示失败
        Toast.show({
          content: t("login.failed"),
          position: "center",
        });
        return;
      }
      if (!user) {
        const auth = store.getState().auth.authInfo || null;
        if (auth.needLogin) {
          // 未登录过，前往登录页
          router.replace(`/login`);
        }
        return;
      }
      // 提示成功，并跳转到首页
      store.dispatch(
        updateAuthStep({
          type: MsgStatus.success,
          content: t("auth.success"),
        })
      );
      // 初始化成功，
      store.dispatch(saveInitState(appState.init_success));
      router.replace("/home");
    } catch (err) {
      console.error("登录失败:", err);
    }
  };

  const handlePayment = () => {
    if (!selectedPlan) return;

    setIsProcessing(true);

    // 创建支付订单，
    createPayOrder();
  };

  const finishPayment = () => {
    if (!orderInfo || !orderInfo.orderId) {
      Toast.show({
        icon: "fail",
        content: t("order.no_order_info"),
        position: "center",
      });
      return;
    }
    getStoragePurchaseStatus(orderInfo.orderId);
  };

  const getPackagesList = async () => {
    try {
      const wxPayManager = container.get("wxPayManager");
      if (!wxPayManager) {
        Toast.show({
          icon: "fail",
          content: t("order.wxpay_not_init"),
          position: "center",
        });
        return [];
      }
      const lang = i18n.language || "en";
      const [infos, error] = await wxPayManager.getPackages({
        pkgType: PackageType.STORAGE_PURCHASE,
        lang:
          lang && lang.indexOf("en") !== -1 ? PackageLang.en : PackageLang.zh,
        currency: CurrencyType.CNY,
      });
      if (error) {
        Toast.show({
          icon: "fail",
          content: error.message || t("order.get_order_failed"),
          position: "center",
        });
        return [];
      }
      setStoragePlans(infos);
    } catch (error) {
      console.error("获取支付订单出错:", error);
    }
  };

  const createPayOrder = async () => {
    try {
      const wxPayManager = container.get("wxPayManager");
      if (!wxPayManager) {
        Toast.show({
          icon: "fail",
          content: t("order.wxpay_not_init"),
          position: "center",
        });
        return [];
      }
      const timeExpire = dayjs()
        .add(5, "minute")
        .format("YYYY-MM-DDTHH:mm:ssZ");

      const [tradeNo, error] = await wxPayManager.createOrder({
        account: account.nftAccount || "",
        pkgId: selectedPlan?.pkgId || 0,
        description: selectedPlan?.pkgName || "",
        amount: {
          total: selectedPlan?.amount || 0,
        },
        dappid: dcConfig.appInfo.appId,
        timeExpire: timeExpire,
      });
      if (error) {
        Toast.show({
          icon: "fail",
          content: error.message || t("order.create_order_failed"),
          position: "center",
        });
        return [];
      }
      getNativePrepay(tradeNo);
    } catch (error) {
      setIsProcessing(false);
      console.error("创建支付订单出错:", error);
    }
  };

  const getNativePrepay = async (tradeNo: string) => {
    try {
      const wxPayManager = container.get("wxPayManager");
      if (!wxPayManager) {
        Toast.show({
          icon: "fail",
          content: t("order.wxpay_not_init"),
          position: "center",
        });
        return [];
      }
      const [codeUrl, error] = await wxPayManager.getNativePrepay(tradeNo);
      if (error) {
        Toast.show({
          icon: "fail",
          content: error.message || t("order.get_qrcode_failed"),
          position: "center",
        });
        return [];
      }
      // 保存订单
      const record = {
        dappid: dcConfig.appInfo.appId,
        orderId: tradeNo,
        nftAccount: account.nftAccount || "",
        pkgId: selectedPlan?.pkgId || 0,
        pkgName: selectedPlan?.pkgName || "",
        amount: selectedPlan?.amount || 0,
        currency: selectedPlan?.currency || CurrencyType.CNY,
        status: StoragePurchaseStatus.WAITING_CONFIRM as number,
        description: "",
        createTime: Date.now(),
      };
      const id = await addOrderRecord(record);
      setOrderInfo({
        ...record,
        _id: id,
      });
      const url = await QRCode.toDataURL(codeUrl);
      setQrCodeUrl(url);
      setStep(3);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      console.error("获取支付二维码出错:", error);
    }
  };

  const getStoragePurchaseStatus = async (tradeNo: string) => {
    try {
      const wxPayManager = container.get("wxPayManager");
      if (!wxPayManager) {
        Toast.show({
          icon: "fail",
          content: t("order.wxpay_not_init"),
          position: "center",
        });
        return [];
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
        return [];
      }
      // 根据状态处理
      if (status === StoragePurchaseStatus.SUCCESS) {
        // 更新订单状态
        await updateOrderRecord({
          ...orderInfo,
          status: StoragePurchaseStatus.SUCCESS as number,
        });
        Toast.show({
          icon: "success",
          content: t("order.subscribe_success"),
          position: "center",
        });
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
            Toast.show({
              content: t("order.order_expired"),
              position: "center",
            });
            return;
          }
        }
        Toast.show({
          content: t("order.order_pending"),
          position: "center",
        });
      }
    } catch (error) {
      console.error("查询订单出错:", error);
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-white/10 rounded-2xl shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-bold">
              {t("order.subscription_title")}
            </h2>
          </div>
          <Button
            onClick={onClose}
            className="p-2 rounded-full text-white hover:bg-white/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 1 ? (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <p className="text-gray-300 mb-4">{t("order.select_plan")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  {storagePlans.map((plan) => (
                    <Card
                      key={plan.pkgId}
                      className={`relative rounded-xl p-4 lg:p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                        plan.pkgId === selectedPlan?.pkgId
                          ? "border-2 border-blue-500 shadow-lg"
                          : "border border-white/8"
                      }`}
                      // allow clicking card to select
                      onClick={() => handleSelectPlan(plan) as any}
                    >
                      {/* {plan.pkgId === selectedPlan?.pkgId && (
                        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-xl">
                          热门推荐
                        </div>
                      )} */}
                      <div className="text-center">
                        {/* <div className={`text-sm mt-1 ${plan.pkgId === selectedPlan?.pkgId ? "text-gray-100" : "text-gray-400"}`}>
                            每年
                          </div> */}
                        <div className="my-4 lg:my-6">
                          {/* <div className="text-3xl lg:text-4xl font-extrabold">
                            <span className={`${plan.pkgId === selectedPlan?.pkgId ? "text-blue-300" : "text-gray-300"}`}>
                              {plan.spaceSize}
                            </span>
                            <span className={`ml-2 text-base lg:text-lg ${plan.pkgId === selectedPlan?.pkgId ? "text-gray-100" : "text-gray-400"}`}>
                              {plan.currency === CurrencyType.CNY ? "元" : "美元"}
                            </span>
                          </div> */}
                          <h3
                            className={`text-lg lg:text-xl font-bold ${
                              plan.pkgId === selectedPlan?.pkgId
                                ? "text-blue-300"
                                : "text-white"
                            }`}
                          >
                            {plan.pkgName}
                          </h3>
                        </div>

                        <div className="my-4 lg:my-6">
                          <div className="text-2xl lg:text-3xl font-bold text-green-400">
                            {plan.currency === CurrencyType.CNY ? "¥" : "$"}
                            {plan.amount ? (plan.amount * 0.01).toFixed(2) : 0}
                            <span
                              className={`text-sm mt-1 ${
                                plan.pkgId === selectedPlan?.pkgId
                                  ? "text-gray-100"
                                  : "text-gray-400"
                              }`}
                            >
                              {t("order.month_12")}
                            </span>
                          </div>
                        </div>

                        {/* <Button
                          variant={plan.pkgId === selectedPlan?.pkgId ? "primary" : "neutral"}
                          className="w-full py-2 lg:py-3 rounded-lg font-bold transition text-sm lg:text-base"
                          onClick={() => handleSelectPlan(plan)}
                        >
                          选择此套餐
                        </Button> */}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-white/10 shrink-0 flex">
                <Button
                  onClick={nextStep}
                  className="flex-1 py-3"
                  variant="primary"
                >
                  {t("order.next_step")}
                </Button>
                {(!account || !account.nftAccount) && (
                  <Button
                    onClick={gotoLogin}
                    className="flex-1 ml-4 py-3"
                    variant="neutral"
                  >
                    {t("login.login")}
                  </Button>
                )}
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-2xl mx-auto">
                  <div className="bg-white/5 rounded-xl p-4 lg:p-6 mb-4 lg:mb-6 border border-white/10">
                    <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-white">
                      {t("order.confirm_purchase")}
                    </h3>
                    <div className="flex items-center justify-between p-3 lg:p-4 bg-white/5 rounded-lg border border-white/10">
                      <div>
                        <h4 className="font-bold text-white">
                          {selectedPlan.pkgName}
                        </h4>
                        <p className="text-gray-400 text-sm lg:text-base">
                          {selectedPlan.spaceSize}GB /{selectedPlan.validDays}
                          {t("order.day")}
                        </p>
                      </div>
                      <div className="text-lg lg:text-xl font-bold text-white">
                        {selectedPlan.currency === CurrencyType.CNY ? "¥" : "$"}
                        {selectedPlan.amount
                          ? (selectedPlan.amount * 0.01).toFixed(2)
                          : 0}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 lg:p-6 mb-4 lg:mb-6 border border-white/10">
                    <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-white">
                      {t("order.payment_method")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
                      <div
                        className={`border-2 rounded-lg p-3 lg:p-4 cursor-pointer transition ${
                          paymentMethod === "wechat"
                            ? "border-green-500 bg-green-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setPaymentMethod("wechat")}
                      >
                        <div className="flex items-center">
                          <div className="bg-green-500 rounded-full p-1.5 lg:p-2 mr-2 lg:mr-3">
                            <svg
                              className="h-5 w-5 lg:h-6 lg:w-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.952 16.544c-.007-.007-.015-.014-.029-.014-.015 0-.022.007-.029.014-.651.651-1.697.651-2.348 0-.651-.651-.651-1.697 0-2.348.651-.651 1.697-.651 2.348 0 .651.651.651 1.697 0 2.348zm5.904 0c-.007-.007-.015-.014-.029-.014-.015 0-.022.007-.029.014-.651.651-1.697.651-2.348 0-.651-.651-.651-1.697 0-2.348.651-.651 1.697-.651 2.348 0 .651.651.651 1.697 0 2.348z" />
                            </svg>
                          </div>
                          <span className="font-medium text-white">
                            {t("order.wechat_pay")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 shrink-0 flex space-x-4">
                <Button
                  onClick={backStep}
                  variant="neutral"
                  className="flex-1 py-3"
                >
                  {t("changePassword.back")}
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  variant="primary"
                  className="flex-1 py-3 flex items-center justify-center"
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
                    `${t("order.confirm_pay")} ${
                      selectedPlan?.currency === CurrencyType.CNY ? "¥" : "$"
                    }${
                      selectedPlan.amount
                        ? (selectedPlan.amount * 0.01).toFixed(2)
                        : 0
                    }`
                  )}
                </Button>
              </div>
            </>
          ) : (
            /* 显示二维码*/
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <p className="text-gray-300 mb-2">
                {t("order.package_name")}：{selectedPlan?.pkgName}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageSubscriptionModal;
