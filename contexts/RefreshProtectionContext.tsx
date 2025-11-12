"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useLayoutEffect,
} from "react";

// 全局状态和处理器引用
declare global {
  interface Window {
    __refreshProtectionEnabled?: boolean;
    __refreshProtectionHandlers?: {
      beforeunload: (event: BeforeUnloadEvent) => void;
      keydown: (event: KeyboardEvent) => void;
    };
  }
}

interface RefreshProtectionContextType {
  enabled: boolean;
}

const RefreshProtectionContext = createContext<
  RefreshProtectionContextType | undefined
>(undefined);

interface RefreshProtectionProviderProps {
  children: ReactNode;
  paramName?: string;
}

export const RefreshProtectionProvider: React.FC<
  RefreshProtectionProviderProps
> = ({ children, paramName = "origin" }) => {
  const [enabled, setEnabled] = useState(false);

  // 立即检查URL参数
  const checkUrlParamImmediately = useCallback((): boolean => {
    if (typeof window === "undefined") return false;

    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has(paramName);
  }, [paramName]);

  // 处理beforeunload事件
  const handleBeforeUnload = useCallback((event: BeforeUnloadEvent) => {
    event.preventDefault();
    const message = "刷新会影响授权，请关闭该网页，重新从原来网页打开授权";
    return message;
  }, []);

  // 处理键盘事件
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const isF5 = event.key === "F5";
    const isCtrlR = (event.ctrlKey || event.metaKey) && event.key === "r";
    const isCtrlF5 = (event.ctrlKey || event.metaKey) && event.key === "F5";
    const isShiftF5 = event.shiftKey && event.key === "F5";
    const isCmdR = event.metaKey && event.key === "r";

    if (isF5 || isCtrlR || isCtrlF5 || isShiftF5 || isCmdR) {
      event.preventDefault();
      event.stopPropagation();
      console.log("刷新快捷键已被阻止");
      return false;
    }
  }, []);

  // 使用useLayoutEffect确保在浏览器绘制前执行
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // 检查内联脚本是否已启用保护
    const hasInlineProtection = window.__refreshProtectionEnabled === true;
    const hasOpenParam = checkUrlParamImmediately();

    if (hasInlineProtection || hasOpenParam) {
      setEnabled(true);

      // 如果内联脚本没有设置保护，则在这里设置
      if (!hasInlineProtection) {
        window.__refreshProtectionEnabled = true;

        // 添加事件监听
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("keydown", handleKeyDown, true);

        // 存储处理函数以便后续移除
        window.__refreshProtectionHandlers = {
          beforeunload: handleBeforeUnload,
          keydown: handleKeyDown,
        };

        console.log("React组件: 启用页面刷新保护");
      } else {
        console.log("React组件: 使用内联脚本设置的页面刷新保护");
      }
    }
  }, [checkUrlParamImmediately, handleBeforeUnload, handleKeyDown]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.__refreshProtectionHandlers) {
        window.removeEventListener(
          "beforeunload",
          window.__refreshProtectionHandlers.beforeunload
        );
        window.removeEventListener(
          "keydown",
          window.__refreshProtectionHandlers.keydown,
          true
        );
        window.__refreshProtectionEnabled = false;
        console.log("移除页面刷新保护监听器");
      }
    };
  }, []);

  return (
    <RefreshProtectionContext.Provider value={{ enabled }}>
      {children}
    </RefreshProtectionContext.Provider>
  );
};

export const useRefreshProtection = () => {
  const context = useContext(RefreshProtectionContext);
  if (context === undefined) {
    throw new Error(
      "useRefreshProtection must be used within a RefreshProtectionProvider"
    );
  }
  return context;
};
