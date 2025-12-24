import React, { useCallback, useEffect, useState } from "react";
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
  const [showAccountSwitchModal, setShowAccountSwitchModal] = useState(false);
  const account: AccountInfo = useAppSelector((state) => state.wallet.account);

  const authInfo = useAppSelector((state) => state.auth.authInfo);

  const handleLogin = useCallback(async () => {
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
        if (authInfo.needLogin) {
          // 未登录过，前往登录页
          router.replace(`/login`);
        }
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
      router.replace(`/${window.location.pathname}${window.location.search}`);
    } catch (err) {
      console.error("登录失败:", err);
    }
  }, [authInfo]);

  const handleLogout = async () => {
    try {
      // 清除本地状态
      setShowAccountSwitchModal(false);
    } catch (err) {
      console.error("登出失败:", err);
    }
  };

  useEffect(() => {
    if (account && account.nftAccount) {
      setAccountInfo(account);
    }
  }, [account?.nftAccount]);
  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-white/5 bg-slate-900/50 h-[72px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <div className="w-5 h-5 border-2 border-white rounded-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              DCLogin
            </h1>
            <p className="text-xs text-slate-400">{t("home.subtitle")}</p>
          </div>
        </div>
        <div className="relative">
          {accountInfo ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAccountSwitchModal(true)}
                className="flex items-center space-x-3 focus:outline-none group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                    {accountInfo.nftAccount || t("home.user_default")}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t("home.connected")}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-all">
                  <User2
                    className="text-white group-hover:text-primary"
                    size={20}
                  />
                </div>
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="btn-primary flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{t("home.login")}</span>
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
