/**
 * 提醒
 */

import AddDAPPNote from "./addDAPP";
import SignatureDAPP from "./signatureDAPP";
import React from "react";
import { createRoot } from "react-dom/client";

import { APPInfo } from "@/types/pageType";
import EncodePassword from "./encodePassword";
import utilHelper from "@/helpers/utilHelper";
import i18n from "@/locales/i18n";
import { EncodePasswordType } from "@/config/constant";
import NavigationService from "@/lib/navigation";
export const showAddDAPPNote = (
  info: APPInfo,
  confirmCallback: () => void
) => {
  const containerId = "add-dapp-note-container";
  // 先检查是否已存在，如果存在则移除
  const existingContainer = document.getElementById(containerId);
  if (existingContainer) {
    document.body.removeChild(existingContainer);
  }
  const container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    React.createElement(AddDAPPNote, {
      info,
      confirmFun: () => {
        document.body.removeChild(container);
        // 确认结束
        console.log("确认结束=====");
        confirmCallback();
      },
    })
  );
};

export const showSignatureDAPPNote = (
  appUrl: string,
  msg: string | object,
  confirmCallback: () => void
) => {
  const containerId = "signature-dapp-note-container";
  // 先检查是否已存在，如果存在则移除
  const existingContainer = document.getElementById(containerId);
  if (existingContainer) {
    document.body.removeChild(existingContainer);
  }
  const container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    React.createElement(SignatureDAPP, {
      appUrl,
      msg,
      confirmFun: () => {
        document.body.removeChild(container);
        // 确认结束
        console.log("确认结束=====");
        confirmCallback();
      },
    })
  );
};


export const showEncodePassword = (
  info: {iv: Uint8Array, encodeMnimonic: ArrayBuffer},
  appInfo: APPInfo,
  confirmCallback: (userHandleHash: ArrayBuffer | null) => void
) => {
  const containerId = "encode-password-container";
  // 先检查是否已存在，如果存在则移除
  const existingContainer = document.getElementById(containerId);
  if (existingContainer) {
    document.body.removeChild(existingContainer);
  }
  const container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    React.createElement(EncodePassword, {
      type: EncodePasswordType.VERIFY,
      appInfo,
      confirmFun: async (password: string) => {
        // 确认结束
        console.log("确认EncodePassword=====");
        // 解密
        const userHandle = Buffer.from(password);
        const userHandleHash = await crypto.subtle.digest("SHA-256", userHandle);
        const mnemonic = await utilHelper.decryptMnemonic(info.iv, info.encodeMnimonic, userHandleHash);
        if(!mnemonic){
          window.showToast({
            content: i18n.t("account.unlock_wallet_failed"),
            position: "bottom",
          });
          return;
        }
        confirmCallback(userHandleHash);
        document.body.removeChild(container);
      },
      onForgotPassword: () => {
        NavigationService.replace(`/login${window.location.search}`);
        confirmCallback(null);
        document.body.removeChild(container);
      },
    })
  );
};

export const showSetEncodePassword = (
  confirmCallback: (userHandle: Uint8Array | null) => void
) => {
  const containerId = "set-encode-password-container";
  // 先检查是否已存在，如果存在则移除
  const existingContainer = document.getElementById(containerId);
  if (existingContainer) {
    document.body.removeChild(existingContainer);
  }
  const container = document.createElement("div");
  container.id = containerId;
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    React.createElement(EncodePassword, {
      type: EncodePasswordType.SET,
      appInfo: {
        appId: '',
        appName: '',
        appIcon: '',
        appUrl: '',
        appVersion: '',
      },
      confirmFun: async (password: string) => {
        // 确认结束
        console.log("确认EncodePassword=====");
        // 解密
        const userHandle = Buffer.from(password);
        confirmCallback(userHandle);
        document.body.removeChild(container);
      },
      onForgotPassword: () => {
        confirmCallback(null);
        document.body.removeChild(container);
      },
    })
  );
};