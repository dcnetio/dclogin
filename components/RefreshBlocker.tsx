"use client";

import { useEffect } from "react";
import { useRefreshProtection } from "@/contexts/RefreshProtectionContext";

/**
 * 严格的刷新阻止组件，提供额外的保护层
 */
export const StrictRefreshBlocker = () => {
  const { enabled } = useRefreshProtection();

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    // 拦截浏览器历史操作（前进/后退）
    const handlePopState = (event: PopStateEvent) => {
      // 阻止通过浏览器前进后退按钮离开页面
      window.history.pushState(null, document.title, window.location.href);
      console.warn("页面导航已被阻止，请关闭页面重新从来源页面打开");
      event.preventDefault();
    };

    // 拦截所有链接点击，防止导航离开
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a");

      if (link && link.href && !link.href.startsWith("#")) {
        event.preventDefault();
        console.warn("页面导航已被阻止，请关闭页面重新从来源页面打开");
      }
    };

    // 拦截表单提交
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      if (form && form.action) {
        event.preventDefault();
        console.warn("表单提交已被阻止，请关闭页面重新从来源页面打开");
      }
    };

    // 添加历史记录，使后退按钮有效但可以被拦截
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", handleLinkClick, true);
    document.addEventListener("submit", handleFormSubmit, true);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      document.removeEventListener("click", handleLinkClick, true);
      document.removeEventListener("submit", handleFormSubmit, true);
    };
  }, [enabled]);

  return null;
};
