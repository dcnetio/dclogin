"use client";
import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import OrderDetail from "./components/OrderDetail";
import {
  getOrderRecordsWithNFT,
  updateOrderRecord,
} from "@/services/threadDB/orders";
import { AccountInfo } from "@/types/walletTypes";
import { useAppSelector } from "@/lib/hooks";
import { OrderRecord } from "@/types/pageType";
import { CurrencyType, StoragePurchaseStatus } from "@/config/constant";
import { container } from "@/server/dc-contianer";

// 订单列表主组件
export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const account: AccountInfo = useAppSelector((state) => state.wallet.account);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  const getAllOrders = async () => {
    const records = await getOrderRecordsWithNFT(account.nftAccount);
    console.log("=========records", records);
    setOrders(records);
    const _orders: OrderRecord[] = [];
    let updateFlag = false;
    // 获取未完成订单状态，并更新
    for (const order of records) {
      if (order.status !== StoragePurchaseStatus.SUCCESS) {
        const flag = await getStoragePurchaseStatus(order.orderId, order);
        if (flag) {
          _orders.push({
            ...order,
            status: StoragePurchaseStatus.SUCCESS,
          });
          updateFlag = true;
          continue;
        }
      }
      _orders.push({
        ...order,
      });
    }
    if (updateFlag) {
      setOrders(_orders);
    }
  };

  const getStoragePurchaseStatus = async (
    tradeNo: string,
    order: OrderRecord
  ): Promise<boolean> => {
    try {
      const wxPayManager = container.get("wxPayManager");
      if (!wxPayManager) {
        return false;
      }
      const [status, error] = await wxPayManager.getStoragePurchaseStatus(
        tradeNo
      );
      if (!error && status === StoragePurchaseStatus.SUCCESS) {
        // 更新订单状态
        const updateFlag = await updateOrderRecord({
          ...order,
          status: StoragePurchaseStatus.SUCCESS,
        });
        if (updateFlag) {
          return true;
        }
      }
    } catch (error) {
      console.error("查询订单出错:", error);
    } finally {
      return false;
    }
  };
  useEffect(() => {
    if (account && account.nftAccount) {
      getAllOrders();
    }
  }, [account?.nftAccount]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop View */}
        <div className="hidden md:block glass-panel rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            订单列表
          </h2>
          <div className="overflow-hidden rounded-xl border border-white/5">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    套餐名称
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    订单时间
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    金额
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    订单状态
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 bg-transparent">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {order.pkgName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-400">
                        {new Date(order.createTime)?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-white">
                        {order.currency === CurrencyType.CNY ? "¥" : "$"}
                        {order.amount ? (order.amount * 0.01).toFixed(2) : 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                          StoragePurchaseStatus.SUCCESS == order.status
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {StoragePurchaseStatus.SUCCESS == order.status
                          ? "已完成"
                          : "待支付"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewDetail(order)}
                        className="text-primary hover:text-blue-400 font-medium transition-colors"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass-panel rounded-2xl p-5 active:scale-[0.98] transition-transform duration-200">
              <div className="flex flex-1 justify-between items-start mb-4">
                <div>
                  <div className="text-base font-bold text-white text-ellipsis overflow-hidden mb-1">
                    {order.pkgName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(order.createTime)?.toLocaleString()}
                  </div>
                </div>
                <span
                  className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full border ${
                    StoragePurchaseStatus.SUCCESS == order.status
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                  }`}
                >
                  {StoragePurchaseStatus.SUCCESS == order.status
                    ? "已完成"
                    : "待支付"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10">
                <div className="text-xl font-bold text-white tracking-tight">
                  {order.currency === CurrencyType.CNY ? "¥" : "$"}
                  {order.amount ? (order.amount * 0.01).toFixed(2) : 0}
                </div>
                <button
                  onClick={() => handleViewDetail(order)}
                  className="text-primary hover:text-blue-400 text-sm font-medium flex items-center gap-1"
                >
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="glass-panel rounded-2xl p-12 text-center mt-4">
            <div className="text-slate-600 mb-4">
              <Search size={48} className="mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">
              暂无订单信息
            </h3>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={handleCloseDetail} />
      )}
    </div>
  );
}
