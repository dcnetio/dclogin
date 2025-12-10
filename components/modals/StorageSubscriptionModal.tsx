import React, { useState } from "react";

interface StoragePlan {
  id: number;
  name: string;
  storage: number;
  price: number;
  unit: string;
  duration: string;
  popular: boolean;
}

interface StorageSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: StoragePlan) => void;
  userPoints: number;
}

const StorageSubscriptionModal: React.FC<StorageSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  userPoints,
}) => {
  // 存储套餐数据
  const storagePlans: StoragePlan[] = [
    {
      id: 1,
      name: "基础套餐",
      storage: 1,
      price: 10,
      unit: "GB",
      duration: "月",
      popular: false,
    },
    {
      id: 2,
      name: "标准套餐",
      storage: 5,
      price: 45,
      unit: "GB",
      duration: "月",
      popular: false,
    },
    {
      id: 3,
      name: "高级套餐",
      storage: 10,
      price: 80,
      unit: "GB",
      duration: "月",
      popular: true,
    },
    {
      id: 4,
      name: "专业套餐",
      storage: 50,
      price: 350,
      unit: "GB",
      duration: "月",
      popular: false,
    },
    {
      id: 5,
      name: "企业套餐",
      storage: 100,
      price: 600,
      unit: "GB",
      duration: "月",
      popular: false,
    },
    {
      id: 6,
      name: "年度套餐",
      storage: 10,
      price: 800,
      unit: "GB",
      duration: "年",
      popular: false,
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState<StoragePlan | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("wechat");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: StoragePlan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = () => {
    if (!selectedPlan) return;

    setIsProcessing(true);

    // 模拟支付处理
    setTimeout(() => {
      setIsProcessing(false);
      alert(
        `成功购买 ${selectedPlan.name}：${selectedPlan.storage}${selectedPlan.unit}/${selectedPlan.duration}，价格：¥${selectedPlan.price}`
      );
      setSelectedPlan(null);
    }, 2000);
  };

  const handlePointsExchange = () => {
    if (!selectedPlan) return;
    onSelectPlan(selectedPlan);
    setSelectedPlan(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">存储套餐订阅</h2>
              <p className="text-gray-900 mt-1">选择适合您的存储方案</p>
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
          {!selectedPlan ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {storagePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative rounded-xl p-6 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-br from-blue-900 to-indigo-800 border-2 border-blue-500 shadow-lg shadow-blue-500/20"
                      : "bg-white border border-gray-300 hover:border-blue-500 shadow-lg shadow-gray-300/20"
                  }`}
                  onClick={() => handleSelectPlan(plan)}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-xl">
                      热门推荐
                    </div>
                  )}

                  <div className="text-center">
                    <h3
                      className={`text-xl font-bold ${
                        plan.popular ? "text-blue-300" : "text-white"
                      }`}
                    >
                      {plan.name}
                    </h3>

                    <div className="my-6">
                      <div className="text-4xl font-extrabold">
                        <span
                          className={`${
                            plan.popular ? "text-blue-300" : "text-gray-600"
                          }`}
                        >
                          {plan.storage}
                        </span>
                        <span
                          className={`text-lg ${
                            plan.popular ? "text-gray-100" : "text-gray-500"
                          }`}
                        >
                          {plan.unit}
                        </span>
                      </div>
                      <div
                        className={`text-sm mt-1 ${
                          plan.popular ? "text-gray-100" : "text-gray-600"
                        }`}
                      >
                        /{plan.duration}
                      </div>
                    </div>

                    <div className="my-6">
                      <div className="text-3xl font-bold text-green-400">
                        ¥{plan.price}
                      </div>
                    </div>

                    <button
                      className={`w-full py-3 rounded-lg font-bold transition ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900 "
                      }`}
                    >
                      选择此套餐
                    </button>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <ul
                        className={`space-y-3  text-sm ${
                          plan.popular ? "text-gray-100" : "text-gray-600"
                        }`}
                      >
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          高速上传下载
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          数据加密存储
                        </li>
                        <li className="flex items-center">
                          <svg
                            className="h-5 w-5 text-green-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          24/7 技术支持
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">确认购买</h3>
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <h4 className="font-bold">{selectedPlan.name}</h4>
                    <p className="text-gray-600">
                      {selectedPlan.storage}
                      {selectedPlan.unit}/{selectedPlan.duration}
                    </p>
                  </div>
                  <div className="text-xl font-bold">¥{selectedPlan.price}</div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold mb-4">支付方式</h3>
                <div className="grid grid-cols-2 gap-4">
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

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition ${
                      paymentMethod === "alipay"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                    onClick={() => setPaymentMethod("alipay")}
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-500 rounded-full p-2 mr-3">
                        <svg
                          className="h-6 w-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 22c-5.514 0-10-4.486-10-10s4.486-10 10-10 10 4.486 10 10-4.486 10-10 10zm-2-17h-2v14h2v-7h2v7h2v-14h-4z" />
                        </svg>
                      </div>
                      <span className="font-medium">支付宝</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 rounded-xl p-6 mb-6">
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
                      {Math.min(userPoints / 100, selectedPlan.price).toFixed(
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
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedPlan(null)}
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
                    `确认支付 ¥${selectedPlan.price}`
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 text-center text-gray-600 text-sm">
            <p>所有套餐均支持自动续费，可在个人中心取消</p>
            <p className="mt-2">积分余额: {userPoints} 积分</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageSubscriptionModal;
