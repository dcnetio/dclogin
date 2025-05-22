/**
 * 提醒
 */

import AddDAPPNote from "./addDAPP";
import SignatureDAPP from "./signatureDAPP";
import React from "react";
import { createRoot } from "react-dom/client";

import { APPInfo } from "@/types/pageType";
import EncodePassword from "./encodePassword";
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
  type: number, // 类型，1设置，2验证
  confirmCallback: (password: string) => void
) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    React.createElement(EncodePassword, {
      type,
      confirmFun: (password: string) => {
        document.body.removeChild(container);
        // 确认结束
        console.log("确认EncodePassword=====");
        confirmCallback(password);
      },
    })
  );
};