"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import OrderDetail from "./components/page";
import {
  getOrderRecordsWithNFT,
  updateOrderRecord,
} from "@/services/threadDB/orders";
import { AccountInfo } from "@/types/walletTypes";
import { useAppSelector } from "@/lib/hooks";
import { OrderRecord } from "@/types/pageType";
import { CurrencyType, StoragePurchaseStatus } from "@/config/constant";
import { Toast } from "antd-mobile";
import { container } from "@/server/dc-contianer";

// 订单列表主组件
export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
    <div className="h-full bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-xl font-bold text-gray-900">订单列表</h1>
          <p className="mt-2 text-sm text-gray-600">管理和查看您的所有订单</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-4 py-4">
        <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  套餐名称
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金额
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  订单状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.pkgName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {new Date(order.createTime)?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {order.currency === CurrencyType.CNY ? "¥" : "$"}
                      {order.amount ? (order.amount * 0.01).toFixed(2) : 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        StoragePurchaseStatus.SUCCESS == order.status
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
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
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-1  justify-between items-start mb-3">
                <div>
                  <div className="text-sm font-medium text-gray-900 text-ellipsis overflow-hidden">
                    {order.pkgName}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(order.createTime)?.toLocaleString()}
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    StoragePurchaseStatus.SUCCESS == order.status
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {StoragePurchaseStatus.SUCCESS == order.status
                    ? "已完成"
                    : "待支付"}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="text-lg font-semibold text-gray-900">
                  {order.currency === CurrencyType.CNY ? "¥" : "$"}
                  {order.amount ? (order.amount * 0.01).toFixed(2) : 0}
                </div>
                <button
                  onClick={() => handleViewDetail(order)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {orders.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            暂无订单信息
          </h3>
        </div>
      )}

      {selectedOrder && (
        <OrderDetail order={selectedOrder} onClose={handleCloseDetail} />
      )}
    </div>
  );
}
