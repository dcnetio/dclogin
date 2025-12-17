"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/common/header";
import PointsExchangeModal from "@/components/modals/PointsExchangeModal";
import StorageSubscriptionModal from "@/components/modals/StorageSubscriptionModal";
import { getDC } from "@/components/auth/login/dc";
import { APPThemeConfig } from "@/config/define";
import { useAppSelector } from "@/lib/hooks";
import { getUserInfoWithNft } from "@/services/account";
import { User } from "web-dc-api";
import { Toast } from "antd-mobile";
import ethers from "@/helpers/ethersHelper";
import {
  asyncAuthRecord,
  getAuthRecordsWithAccount,
} from "@/services/account/record";
import { AuthRecord } from "@/types/pageType";
import { AccountInfo } from "@/types/walletTypes";
import { useSearchParams } from "next/navigation";
import DAPPNote from "@/components/note/DAPPNote";
import { container } from "@/server/dc-contianer";
import i18n from "@/locales/i18n";
import { CurrencyType, PackageType } from "@/config/constant";
interface UserInfo extends User {
  points: number;
}

const Dashboard = () => {
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [loginHistory, setLoginHistory] = useState<AuthRecord[]>([]);
  const [displayedLoginHistory, setDisplayedLoginHistory] = useState<
    AuthRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showStorageModal, setShowStorageModal] = useState(false);

  const account: AccountInfo = useAppSelector((state) => state.wallet.account);

  const HISTORY_PAGE_SIZE = 3;
  // 获取用户信息的逻辑
  const getUserInfo = async () => {
    // setIsLoading(true);
    // 获取用户信息
    const [userInfo, error] = await getUserInfoWithNft(account.nftAccount);
    if (error) {
      Toast.show({
        content: error.message || "获取用户信息失败",
        position: "center",
      });
      return;
    }
    // 获取用户余额
    const balance = await ethers.getUserBalance(account.account);
    userInfo.points = balance;
    setUserInfo(userInfo);
    // 获取授权记录
    getAuthHistorys(account.account);
  };

  const getAuthHistorys = async (accountStr: string): Promise<AuthRecord[]> => {
    try {
      console.log("getAuthHistorys accountStr", accountStr);
      const records = await getAuthRecordsWithAccount(accountStr);
      setLoginHistory(records);
      // 同步授权记录
      const flag = await asyncAuthRecord(accountStr);
      if (flag) {
        const nrecords = await getAuthRecordsWithAccount(accountStr);
        setLoginHistory(nrecords);
      }
    } catch (error) {
      console.log("getAuthHistorys error", error);
      Toast.show({
        content: error.message || "获取授权记录失败",
        position: "center",
      });
      return [];
    }
  };

  const handleLoadMoreHistory = () => {
    setHistoryPage((prevPage) => prevPage + 1);
  };

  const handleSubscribeStorage = () => {
    setShowStorageModal(true);
  };

  const handleSelectStoragePlan = (plan: any) => {
    alert(
      `您选择了 ${plan.name}：${plan.storage}${plan.unit}/${plan.duration}，价格：¥${plan.price}`
    );
    setShowStorageModal(false);
  };

  const handleExchangePoints = async (points: number) => {
    try {
      const dc = await getDC();
      if (!dc) {
        throw new Error("未获取到有效的 DC 实例");
      }

      let [kvdb] = await dc.keyValue.getStore(
        dc.appInfo.appId,
        "keyvalue_user_pub",
        APPThemeConfig.appThemeAuthor
      );
      if (!kvdb) {
        throw new Error("用户主题不存在");
      }

      alert(`成功兑换 ${points} 积分`);
    } catch (err) {
      setError(err.message || "兑换失败");
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleRefreshLoginHistory = async () => {
    if (account && account.account) {
      const accountStr = account.account;
      // 同步授权记录
      const flag = await asyncAuthRecord(accountStr);
      if (flag) {
        const nrecords = await getAuthRecordsWithAccount(accountStr);
        setLoginHistory(nrecords);
      }
    }
  };

  useEffect(() => {
    if (account && account.nftAccount) {
      getUserInfo();
    }
  }, [account?.nftAccount]);

  useEffect(() => {
    // 当历史记录或页码变化时，更新显示的记录
    const startIndex = 0;
    const endIndex = historyPage * HISTORY_PAGE_SIZE;
    setDisplayedLoginHistory(loginHistory.slice(startIndex, endIndex) || []);
  }, [loginHistory, historyPage]);

  if (!!origin && (!account || !account.nftAccount)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <DAPPNote />
      </div>
    );
  }
  if (error && !userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-400 mb-4">错误</h2>
          <p className="text-gray-900 mb-4">{error}</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* 顶部用户信息栏 */}
      <Header />

      <div className="container mx-auto p-4">
        {/* 账户概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 存储使用情况 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">存储使用</h3>
              <div className="bg-green-500 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 7v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>已使用: {formatBytes(userInfo?.usedSpace || 0)}</span>
                <span>总共: {formatBytes(userInfo?.subscribeSpace || 0)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      ((userInfo?.usedSpace ? userInfo?.usedSpace : 0) /
                        (userInfo?.subscribeSpace || 1)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-800">
                到期区块高度:{" "}
                {userInfo?.expireNumber ? userInfo.expireNumber : "-"}
              </p>
              <button
                onClick={handleSubscribeStorage}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                订阅更多存储
              </button>
            </div>
          </div>

          {/* 积分余额 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">积分余额</h3>
              <div className="bg-yellow-500 rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0 1 1 0 002 0zm-1 4a1 1 0 110-2 1 1 0 010 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-3xl font-bold">
                {userInfo?.points || 0} 积分
              </div>
              <button
                onClick={() => setShowExchangeModal(true)}
                className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded"
              >
                兑换积分
              </button>
            </div>
          </div>
        </div>

        {/* 登录历史 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex justify-between">
            <span>登录历史</span>
            <button
              onClick={handleRefreshLoginHistory}
              className="ml-4 text-sm text-blue-500 hover:text-blue-700"
            >
              刷新
            </button>
          </h3>
          {displayedLoginHistory.length > 0 ? (
            <div className="space-y-3">
              {displayedLoginHistory.map((item: AuthRecord) => (
                <div key={item.recordId} className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{item.appName}</h4>
                      <p className="text-sm text-gray-900">{item.appUrl}</p>
                    </div>
                    <div className="text-sm text-gray-900">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
              {displayedLoginHistory.length < loginHistory.length && (
                <button
                  onClick={handleLoadMoreHistory}
                  className="w-full py-2 bg-white hover:bg-gray-200 rounded-lg text-center"
                >
                  加载更多
                </button>
              )}
            </div>
          ) : (
            <p className="text-gray-600">暂无登录历史</p>
          )}
        </div>

        {/* 应用列表 */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">应用列表</h3>
          {apps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {apps.map((app) => (
                <div
                  key={app.id}
                  className="bg-gray-100 rounded-lg p-4 flex items-center"
                >
                  <img
                    src={
                      app.iconUrl ||
                      "https://images.unsplash.com/photo-1637593992672-ed85a851fdc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    }
                    alt={app.name}
                    className="w-12 h-12 rounded-lg mr-4"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1637593992672-ed85a851fdc3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80";
                    }}
                  />
                  <div>
                    <h4 className="font-medium">{app.name}</h4>
                    <p className="text-sm text-gray-900">{app.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">暂无应用</p>
          )}
        </div>
      </div>

      {/* 存储订阅模态框 */}
      <StorageSubscriptionModal
        isOpen={showStorageModal}
        onClose={() => setShowStorageModal(false)}
        onSelectPlan={handleSelectStoragePlan}
        userPoints={userInfo?.points || 0}
      />

      {/* 积分兑换模态框 */}
      <PointsExchangeModal
        isOpen={showExchangeModal}
        onClose={() => setShowExchangeModal(false)}
        userPoints={userInfo?.points || 0}
        onExchange={handleExchangePoints}
      />
    </div>
  );
};

export default Dashboard;
