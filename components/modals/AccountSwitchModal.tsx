import React, { useState, useEffect } from "react";

interface Account {
  id: string;
  publicKey: string;
  name: string;
  isCurrent: boolean;
}

interface AccountSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountSwitch: (account: Account) => void;
  onLoginNewAccount: () => void;
}

const AccountSwitchModal: React.FC<AccountSwitchModalProps> = ({
  isOpen,
  onClose,
  onAccountSwitch,
  onLoginNewAccount,
}) => {
  const [accountInfo, setAccountInfo] = useState<Account | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // 初始化账号列表
  useEffect(() => {
    // 从本地存储获取已保存的账号
    const savedAccounts = localStorage.getItem("dc_accounts");
    let accountList: Account[] = [];

    if (savedAccounts) {
      accountList = JSON.parse(savedAccounts);
    } else {
      // 如果没有保存的账号，创建当前账号
      const publicKey = accountInfo?.publicKey || "";
      accountList = [
        {
          id: `account_${Date.now()}`,
          publicKey: publicKey,
          name: `用户${publicKey ? publicKey.substring(0, 8) : "未知"}`,
          isCurrent: true,
        },
      ];
      localStorage.setItem("dc_accounts", JSON.stringify(accountList));
    }

    // 确保当前账号被标记
    const updatedAccounts = accountList.map((acc) => ({
      ...acc,
      isCurrent: acc.publicKey === (accountInfo?.publicKey || ""),
    }));

    setAccounts(updatedAccounts);
  }, [isOpen, accountInfo]);

  // 切换账号
  const handleSwitchAccount = (account: Account) => {
    if (account.isCurrent) return;

    // 更新本地存储中的当前账号标记
    const updatedAccounts = accounts.map((acc) => ({
      ...acc,
      isCurrent: acc.publicKey === account.publicKey,
    }));

    setAccounts(updatedAccounts);
    localStorage.setItem("dc_accounts", JSON.stringify(updatedAccounts));

    // 通知父组件切换账号
    onAccountSwitch(account);
    onClose();
  };

  // 登录新账号
  const handleLoginNewAccount = () => {
    onLoginNewAccount();
    onClose();
  };

  // 删除账号
  const handleDeleteAccount = (accountId: string, publicKey: string) => {
    // 不能删除当前账号
    const accountToDelete = accounts.find((acc) => acc.id === accountId);
    if (accountToDelete?.isCurrent) {
      alert("不能删除当前账号");
      return;
    }

    // 至少保留一个账号
    if (accounts.length <= 1) {
      alert("至少需要保留一个账号");
      return;
    }

    setIsDeleting(accountId);

    // 模拟删除操作
    setTimeout(() => {
      const updatedAccounts = accounts.filter((acc) => acc.id !== accountId);
      setAccounts(updatedAccounts);
      localStorage.setItem("dc_accounts", JSON.stringify(updatedAccounts));
      setIsDeleting(null);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold">账号管理</h3>
          <button onClick={onClose} className="text-gray-800 hover:text-white">
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

        <div className="p-4">
          <div className="mb-4">
            <button
              onClick={handleLoginNewAccount}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              登录新账号
            </button>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  account.isCurrent
                    ? "bg-blue-900/50 border border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <div
                  className="flex items-center cursor-pointer flex-1"
                  onClick={() => handleSwitchAccount(account)}
                >
                  <div className="bg-gray-100 rounded-full p-2 mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{account.name}</p>
                    <p className="text-xs text-gray-600 truncate">
                      {account.publicKey
                        ? `${account.publicKey.substring(0, 24)}...`
                        : "未知公钥"}
                    </p>
                  </div>
                  {account.isCurrent && (
                    <span className="ml-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      当前
                    </span>
                  )}
                </div>

                {!account.isCurrent && (
                  <button
                    onClick={() =>
                      handleDeleteAccount(account.id, account.publicKey)
                    }
                    disabled={isDeleting === account.id}
                    className="ml-2 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-full"
                  >
                    {isDeleting === account.id ? (
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
