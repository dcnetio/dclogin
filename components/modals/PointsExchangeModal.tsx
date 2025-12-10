import React, { useState } from "react";

interface PointsExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPoints: number;
  onExchange: (points: number) => void;
}

const PointsExchangeModal: React.FC<PointsExchangeModalProps> = ({
  isOpen,
  onClose,
  userPoints,
  onExchange,
}) => {
  const [exchangePoints, setExchangePoints] = useState(10);

  if (!isOpen) return null;

  const handleExchange = () => {
    if (exchangePoints <= 0) {
      alert("兑换积分必须大于0");
      return;
    }

    if (exchangePoints > userPoints) {
      alert("积分余额不足");
      return;
    }

    onExchange(exchangePoints);
    setExchangePoints(10);
  };

  const handleSetPoints = (amount: number) => {
    if (amount <= userPoints) {
      setExchangePoints(amount);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-bold">积分兑换</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
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
        <div className="p-6">
          <div className="mb-4">
            <label className="block text-gray-800 mb-2">
              当前积分余额: {userPoints}
            </label>
            <label className="block text-gray-800 mb-2">兑换积分数量</label>
            <input
              type="number"
              min="1"
              max={userPoints}
              value={exchangePoints}
              onChange={(e) => setExchangePoints(parseInt(e.target.value) || 0)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-gray-700 focus:outline-none "
            />
            <div className="flex space-x-2 mt-2">
              {[10, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => handleSetPoints(amount)}
                  disabled={amount > userPoints}
                  className={`px-3 py-1 rounded text-sm ${
                    exchangePoints === amount
                      ? "bg-blue-600 text-white"
                      : amount > userPoints
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-500 text-white hover:bg-gray-300"
                  }`}
                >
                  {amount}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-900 mb-2">可兑换服务</label>
            <div className="bg-gray-100 rounded p-4">
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>10积分 - 100MB存储空间</span>
                </li>
                <li className="flex justify-between">
                  <span>50积分 - 1GB存储空间</span>
                </li>
                <li className="flex justify-between">
                  <span>100积分 - 5GB存储空间</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded"
            >
              取消
            </button>
            <button
              onClick={handleExchange}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-white"
            >
              确认兑换
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsExchangeModal;
