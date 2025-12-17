import React, { useState, useEffect, useCallback } from "react";

import { AddOutline, CloseOutline } from "antd-mobile-icons";
import { AccountInfo } from "@/types/walletTypes";
import {
  changeAccount,
  deleteAccount,
  getAllAccounts,
} from "@/services/account";
import { UserCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { saveAccountInfo } from "@/lib/slices/walletSlice";
import { store } from "@/lib/store";
import { useTranslation } from "react-i18next";
interface UserInfo extends AccountInfo {
  isCurrent: boolean;
}

interface AccountSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccountSwitchModal: React.FC<AccountSwitchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [accounts, setAccounts] = useState<UserInfo[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const account: AccountInfo = useAppSelector((state) => state.wallet.account);

  const getAccounts = useCallback(async () => {
    const data = (await getAllAccounts()) || [];
    if (data) {
      // 确保当前账号被标记
      const updatedAccounts = data.map((acc) => ({
        ...acc,
        isCurrent: acc.account === (account?.account || ""),
      }));
      setAccounts(updatedAccounts);
    } else {
      setAccounts([]);
    }
  }, [account?.account]);
  // 切换账号
  const handleSwitchAccount = async (account: UserInfo) => {
    if (account.isCurrent) return;
    const info: AccountInfo = accounts.find(
      (acc) => acc.account === account.account
    );
    // 设置当前用户为新的
    const bool = await changeAccount(info);
    if (!bool) {
      window.showToast({
        content: t("account.switch_failed"),
        position: "center",
      });
      return;
    }

    // 更新本地存储中的当前账号标记
    const updatedAccounts = accounts.map((acc) => ({
      ...acc,
      isCurrent: acc.account === account.account,
    }));

    setAccounts(updatedAccounts);

    // 保存用户信息
    const toSaveAccountInfo: AccountInfo = {
      url: info.url,
      name: info.name,
      nftAccount: info.nftAccount,
      account: info.account,
      credentialId: info.credentialId,
      timeStamp: info.timeStamp,
      type: info.type,
    };
    store.dispatch(saveAccountInfo(toSaveAccountInfo));
    onClose();
  };

  // 登录新账号
  const handleLoginNewAccount = () => {
    // 进入登录页面
    router.push("/login");
    onClose();
  };

  // 删除账号
  const handleDeleteAccount = async (account: string) => {
    // 不能删除当前账号
    const accountToDelete = accounts.find((acc) => acc.account === account);
    if (accountToDelete?.isCurrent) {
      alert("不能删除当前账号");
      return;
    }

    // 至少保留一个账号
    if (accounts.length <= 1) {
      alert("至少需要保留一个账号");
      return;
    }

    setIsDeleting(account);

    // 删除数据库
    await deleteAccount(account);

    // 模拟删除操作
    setTimeout(() => {
      const updatedAccounts = accounts.filter((acc) => acc.account !== account);
      setAccounts(updatedAccounts);
      setIsDeleting(null);
    }, 500);
  };
  // 初始化账号列表
  useEffect(() => {
    getAccounts();
  }, [isOpen, account]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold">账号管理</h3>
          <button
            onClick={onClose}
            className="text-gray-800 hover:text-gray-300"
          >
            <CloseOutline
              fontSize={24}
              onClick={close}
              className="p-1 rounded-sm transition-transform duration-200 
            hover:bg-gray-200 active:scale-95 cursor-pointer"
            />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <button
              onClick={handleLoginNewAccount}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white"
            >
              <AddOutline className="mr-2" fontSize={18} />
              登录新账号
            </button>
          </div>

          <div className="space-y-3">
            {accounts.map((item) => (
              <div
                key={item.account}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  item.isCurrent
                    ? "bg-blue-800/50 border border-blue-200 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div
                  className="flex items-center cursor-pointer flex-1"
                  onClick={() => handleSwitchAccount(item)}
                >
                  <UserCircleIcon className="w-6 h-6 mr-3" size={30} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.account
                        ? `${item.account.slice(0, 10)}
                          ...
                          ${item.account.slice(-8)}`
                        : "未知"}
                    </p>
                    <p
                      className={`text-xs  truncate ${
                        item.isCurrent ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {item.nftAccount ? item.nftAccount : "未知"}
                    </p>
                  </div>
                  {item.isCurrent && (
                    <span className="ml-2 bg-green-600/90 text-white text-xs px-2 py-1 rounded">
                      当前
                    </span>
                  )}
                </div>

                {!item.isCurrent && (
                  <button
                    onClick={() => handleDeleteAccount(item.account)}
                    disabled={isDeleting === item.account}
                    className="ml-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full"
                  >
                    {isDeleting === item.account ? (
                      <svg
                        className="animate-spin h-5 w-5"
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
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          {accounts.length === 0 && (
            <div className="text-center py-8 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p>暂无账号</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-800">
          <p>至少保留一个账号，当前账号无法删除</p>
        </div>
      </div>
    </div>
  );
};

export default AccountSwitchModal;
