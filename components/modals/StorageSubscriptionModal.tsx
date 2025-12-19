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
import { login } from "@/services/account";
import { useTranslation } from "react-i18next";
import { store } from "@/lib/store";
import { updateAuthStep } from "@/lib/slices/authSlice";
import { saveInitState } from "@/lib/slices/appSlice";
import { addOrderRecord, updateOrderRecord } from "@/services/threadDB/orders";
import { OrderRecord } from "@/types/pageType";
import QRCode from "qrcode";

interface StorageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: PackageInfo) => void;
  userPoints: number;
}

const StorageSubscriptionModal: React.FC<StorageSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  userPoints,
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
        content: "请先登录",
        position: "center",
      });
      return;
    }
    if (selectedPlan) {
      setStep(2);
    } else {
      Toast.show({
        content: "请先选择一个存储套餐",
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
        if (authInfo.needLogin) {
          // 未登录过，前往登录页
          router.replace(`/login`);
        }
        return;
      }
      // 提示成功，并跳转到首页
      store.dispatch(
        updateAuthStep({
          type: MsgStatus.failed,
          content: t("auth.success"),
        })
      );
      // 初始化成功，
      store.dispatch(saveInitState(appState.init_success));
      router.replace(`${window.location.pathname}${window.location.search}`);
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
        content: "暂无订单信息",
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
          content: "微信支付管理器未初始化",
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
          content: error.message || "获取支付订单失败",
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
          content: "微信支付管理器未初始化",
          position: "center",
        });
        return [];
      }
      const [tradeNo, error] = await wxPayManager.createOrder({
        account: account.nftAccount || "",
        pkgId: selectedPlan?.pkgId || 0,
        description: selectedPlan?.pkgName || "",
        amount: {
          total: selectedPlan?.amount || 0,
        },
        dappid: dcConfig.appInfo.appId,
      });
      if (error) {
        Toast.show({
          icon: "fail",
          content: error.message || "创建支付订单失败",
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
          content: "微信支付管理器未初始化",
          position: "center",
        });
        return [];
      }
      const [codeUrl, error] = await wxPayManager.getNativePrepay(tradeNo);
      if (error) {
        Toast.show({
          icon: "fail",
          content: error.message || "获取支付二维码失败",
          position: "center",
        });
        return [];
      }
      // 保存订单
      const record = {
        orderId: tradeNo,
        nftAccount: account.nftAccount || "",
        pkgId: selectedPlan?.pkgId || 0,
        pkgName: selectedPlan?.pkgName || "",
        amount: selectedPlan?.amount || 0,
        currency: selectedPlan?.currency || CurrencyType.CNY,
        status: StoragePurchaseStatus.WAITING_CONFIRM,
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
          content: "微信支付管理器未初始化",
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
          content: error.message || "查询订单失败",
          position: "center",
        });
        return [];
      }
      // 根据状态处理
      if (status === StoragePurchaseStatus.SUCCESS) {
        // 更新订单状态
        await updateOrderRecord({
          ...orderInfo,
          status: StoragePurchaseStatus.SUCCESS,
        });
        Toast.show({
          icon: "success",
          content: "订阅成功",
          position: "center",
        });
      } else if (status === StoragePurchaseStatus.WAITING_CONFIRM) {
        Toast.show({
          content: "订单待确认，请稍后查看",
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">存储套餐订阅</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-white bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
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
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            <div>
              <p className="text-gray-900 mb-4">选择适合您的存储方案</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {storagePlans.map((plan) => (
                  <div
                    key={plan.pkgId}
                    className={`relative rounded-xl p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                      plan.pkgId === selectedPlan?.pkgId
                        ? "bg-gradient-to-br from-blue-900 to-indigo-800 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                        : "bg-white border border-gray-300 hover:border-blue-500 shadow-lg shadow-gray-300/20"
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.pkgId === selectedPlan?.pkgId && (
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-xl">
                        热门推荐
                      </div>
                    )}
                    <div className="text-center">
                      <h3
                        className={`text-xl font-bold ${
                          plan.pkgId === selectedPlan?.pkgId
                            ? "text-blue-300"
                            : "text-white"
                        }`}
                      >
                        {plan.pkgName}
                      </h3>

                      <div className="my-6">
                        <div className="text-4xl font-extrabold">
                          <span
                            className={`${
                              plan.pkgId === selectedPlan?.pkgId
                                ? "text-blue-300"
                                : "text-gray-600"
                            }`}
                          >
                            {plan.spaceSize}
                          </span>
                          <span
                            className={`ml-2 text-lg  ${
                              plan.pkgId === selectedPlan?.pkgId
                                ? "text-gray-100"
                                : "text-gray-500"
                            }`}
                          >
                            {plan.currency === CurrencyType.CNY ? "元" : "美元"}
                          </span>
                        </div>
                        <div
                          className={`text-sm mt-1 ${
                            plan.pkgId === selectedPlan?.pkgId
                              ? "text-gray-100"
                              : "text-gray-600"
                          }`}
                        >
                          /{plan.validDays}天
                        </div>
                      </div>

                      <div className="my-6">
                        <div className="text-3xl font-bold text-green-400">
                          {plan.currency === CurrencyType.CNY ? "¥" : "$"}
                          {plan.amount ? (plan.amount * 0.01).toFixed(2) : 0}
                        </div>
                      </div>

                      <button
                        className={`w-full py-3 rounded-lg font-bold transition ${
                          plan.pkgId === selectedPlan?.pkgId
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-900 "
                        }`}
                      >
                        选择此套餐
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex m-8">
                <button
                  onClick={nextStep}
                  className="flex-1 m-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-white"
                >
                  下一步
                </button>
                {(!account || !account.nftAccount) && (
                  <button
                    onClick={gotoLogin}
                    className="flex-1 m-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-white"
                  >
                    登录
                  </button>
                )}
              </div>
            </div>
          ) : step === 2 ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">确认购买</h3>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <h4 className="font-bold">{selectedPlan.pkgName}</h4>
                    <p className="text-gray-600">
                      {selectedPlan.spaceSize}GB /{selectedPlan.validDays}天
                    </p>
                  </div>
                  <div className="text-xl font-bold">
                    {selectedPlan.currency === CurrencyType.CNY ? "¥" : "$"}
                    {selectedPlan.amount
                      ? (selectedPlan.amount * 0.01).toFixed(2)
                      : 0}
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">支付方式</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      paymentMethod === "wechat"
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                    onClick={() => setPaymentMethod("wechat")}
                  >
                    <div className="flex items-center">
                      <div className="bg-green-500 rounded-full p-2 mr-3">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.952 16.544c-.007-.007-.015-.014-.029-.014-.015 0-.022.007-.029.014-.651.651-1.697.651-2.348 0-.651-.651-.651-1.697 0-2.348.651-.651 1.697-.651 2.348 0 .651.651.651 1.697 0 2.348zm5.904 0c-.007-.007-.015-.014-.029-.014-.015 0-.022.007-.029.014-.651.651-1.697.651-2.348 0-.651-.651-.651-1.697 0-2.348.651-.651 1.697-.651 2.348 0 .651.651.651 1.697 0 2.348z" />
                        </svg>
                      </div>
                      <span className="font-medium">微信支付</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">积分抵扣</h3>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <p className="font-medium">可用积分</p>
                    <p className="text-gray-600 text-sm">1积分=¥0.01</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{userPoints} 积分</p>
                    <p className="text-gray-600 text-sm">
                      可抵扣 ¥
                      {Math.min(userPoints / 100, selectedPlan.amount).toFixed(
                        2
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePointsExchange}
                  className="w-full mt-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium text-white"
                >
                  使用积分抵扣
                </button>
              </div> */}

              <div className="flex space-x-4">
                <button
                  onClick={backStep}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-white"
                >
                  返回
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold flex items-center justify-center text-white"
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
                      处理中...
                    </>
                  ) : (
                    `确认支付 ${
                      selectedPlan?.currency === CurrencyType.CNY ? "¥" : "$"
                    }${
                      selectedPlan.amount
                        ? (selectedPlan.amount * 0.01).toFixed(2)
                        : 0
                    }`
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* 显示二维码*/
            <div className="flex flex-col items-center">
              <p>套餐名称：{selectedPlan?.pkgName}</p>
              <h2 className="text-2xl font-bold m-4">扫一扫付款</h2>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="m-4 w-64 h-64 bg-gray-200"
              />
              <button
                onClick={finishPayment}
                className="py-3 w-64 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold text-white"
              >
                已完成支付
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageSubscriptionModal;
