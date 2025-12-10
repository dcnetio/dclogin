import React, { useState } from "react";
import AccountSwitchModal from "../../modals/AccountSwitchModal";

const Header = () => {
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountSwitchModal, setShowAccountSwitchModal] = useState(false);

  const handleLogin = async () => {
    try {
      // 这里需要通过事件或回调传递登录逻辑
      // 因为useDC hook只能在组件内部使用
      const event = new CustomEvent("header-login-request");
      window.dispatchEvent(event);
    } catch (err) {
      console.error("登录失败:", err);
    }
  };

  const handleLogout = async () => {
    try {
      const event = new CustomEvent("header-logout-request");
      window.dispatchEvent(event);
      setShowUserMenu(false);
    } catch (err) {
      console.error("登出失败:", err);
    }
  };

  const handleAccountSwitch = (account: any) => {
    // 模拟切换账号
    alert(`切换到账号: ${account.name}`);
    // 实际应用中这里需要重新初始化DC连接
  };

  const handleLoginNewAccount = () => {
    // 触发登录新账号的逻辑
    const event = new CustomEvent("header-login-request");
    window.dispatchEvent(event);
  };

  return (
    <div className="bg-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">登录中心</h1>
          <p className="text-gray-600">去中心化身份管理平台</p>
        </div>
        <div className="relative">
          {accountInfo ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAccountSwitchModal(true)}
                className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>账号切换</span>
              </button>

              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="bg-gray-700 rounded-full p-2">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">
                    {accountInfo.publicKey
                      ? `用户${accountInfo.publicKey.substring(0, 8)}`
                      : "用户"}
                  </p>
                </div>
              </button>

              {/* 用户菜单 */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl z-10 border border-gray-700">
                  <div className="p-4 border-b border-gray-700">
                    <p className="font-medium">
                      {accountInfo.publicKey
                        ? `用户${accountInfo.publicKey.substring(0, 8)}`
                        : "用户"}
                    </p>
                    <p className="text-sm text-gray-400 truncate">
                      {accountInfo.publicKey
                        ? `${accountInfo.publicKey.substring(0, 24)}...`
                        : "未获取到公钥"}
                    </p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      个人中心
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 rounded flex items-center text-red-400"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      登出
                    </button>
                  </div>
                  <div className="p-4 border-t border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">公钥信息</p>
                    <p className="text-xs font-mono break-words">
                      {accountInfo.publicKey || "未获取到公钥"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              登录
            </button>
          )}
        </div>
      </div>

      {/* 账号切换模态框 */}
      <AccountSwitchModal
        isOpen={showAccountSwitchModal}
        onClose={() => setShowAccountSwitchModal(false)}
        onAccountSwitch={handleAccountSwitch}
        onLoginNewAccount={handleLoginNewAccount}
      />
    </div>
  );
};

export default Header;
