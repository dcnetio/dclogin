import React, { useEffect, useState } from "react";
import AccountSwitchModal from "../../modals/AccountSwitchModal";
import { login } from "@/services/account";
import { store } from "@/lib/store";
import { updateAuthStep } from "@/lib/slices/authSlice";
import { appState, MsgStatus } from "@/config/constant";
import { useTranslation } from "react-i18next";
import { saveInitState } from "@/lib/slices/appSlice";
import { useRouter } from "next/navigation";
import { Toast } from "antd-mobile";
import { User2 } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { AccountInfo } from "@/types/walletTypes";
const Header = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAccountSwitchModal, setShowAccountSwitchModal] = useState(false);
  const account: AccountInfo = useAppSelector((state) => state.wallet.account);

  const handleLogin = async () => {
    try {
      // 登录逻辑
      const [user, error] = await login();
      if (error) {
        // 提示失败
        Toast.show({
          content: t("login.failed"),
          position: "center",
        });
        setAccountInfo(null);
        return;
      }
      if (!user) {
        // 未登录过，前往登录页
        router.replace(`/login`);
        return;
      }
      setAccountInfo(user);
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

  const handleLogout = async () => {
    try {
      // 清除本地状态
      setShowAccountSwitchModal(false);
    } catch (err) {
      console.error("登出失败:", err);
    }
  };

  const handleLoginNewAccount = () => {
    // 触发登录新账号的逻辑
  };

  useEffect(() => {
    if (account && account.nftAccount) {
      setAccountInfo(account);
    }
  }, [account?.nftAccount]);
  return (
    <div className="bg-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">登录中心</h1>
          <p className="text-gray-700">去中心化身份管理平台</p>
        </div>
        <div className="relative">
          {accountInfo ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAccountSwitchModal(true)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="bg-gray-200 rounded-full p-2">
                  <User2 color="#333" size={18} />
                </div>
                <div>
                  <p className="font-medium">
                    {accountInfo.nftAccount
                      ? `${accountInfo.nftAccount}`
                      : "用户"}
                  </p>
                </div>
              </button>
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
      />
    </div>
  );
};

export default Header;
