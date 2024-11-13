/**
 * 账号相关的
 */
/**
 * 提醒
 */

import { AccountInfo } from "@/types/walletTypes";
import Account from "./account";
import React from "react";
import { createRoot } from "react-dom/client";

export const ChooseAccount = () => {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    root.render(
      React.createElement(Account, {
        visible: true,
        onSuccess: (info: AccountInfo) => {
          document.body.removeChild(container);
          // 确认结束
          console.log("确认结束=====");
          resolve(info);
        },
      })
    );
  })
};
