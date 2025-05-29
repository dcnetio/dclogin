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
export const showAddDAPPNote = (
  info: APPInfo,
  confirmCallback: () => void
) => {
  const container = document.createElement("div");
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
  const container = document.createElement("div");
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
  confirmCallback: (userHandleHash: ArrayBuffer) => void
) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    React.createElement(EncodePassword, {
      type: EncodePasswordType.VERIFY,
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
    })
  );
};

export const showSetEncodePassword = (
  confirmCallback: (userHandle: Uint8Array) => void
) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    React.createElement(EncodePassword, {
      type: EncodePasswordType.SET,
      confirmFun: async (password: string) => {
        // 确认结束
        console.log("确认EncodePassword=====");
        // 解密
        const userHandle = Buffer.from(password);
        confirmCallback(userHandle);
        document.body.removeChild(container);
      },
    })
  );
};