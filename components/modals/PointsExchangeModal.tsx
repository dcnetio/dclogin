import React, { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

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
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">积分兑换</h3>
          <Button variant="ghost" onClick={onClose} className="p-1">
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
        <div className="mt-4">
          <div className="mb-4">
            <label className="block text-muted mb-2">
              当前积分余额: {userPoints}
            </label>
            <label className="block text-muted mb-2">兑换积分数量</label>
            <input
              type="number"
              min="1"
              max={userPoints}
              value={exchangePoints}
              onChange={(e) => setExchangePoints(parseInt(e.target.value) || 0)}
              className="w-full bg-transparent border border-white/8 rounded px-3 py-2 text-white focus:outline-none"
            />
            <div className="flex space-x-2 mt-2">
              {[10, 50, 100].map((amount) => (
                <Button
                  key={amount}
                  onClick={() => handleSetPoints(amount)}
                  disabled={amount > userPoints}
                  variant={
                    exchangePoints === amount
                      ? "primary"
                      : amount > userPoints
                      ? "neutral"
                      : "outline"
                  }
                  className="px-3 py-1 text-sm"
                >
                  {amount}
                </Button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-muted mb-2">可兑换服务</label>
            <div className="glass rounded p-4">
              <ul className="space-y-2 text-white">
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
            <Button
              variant="neutral"
              onClick={onClose}
              className="px-4 py-2 rounded"
            >
              取消
            </Button>
            <Button onClick={handleExchange} className="px-4 py-2 rounded">
              确认兑换
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PointsExchangeModal;
