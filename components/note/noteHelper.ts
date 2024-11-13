/**
 * 提醒
 */

import AddDAPPNote from "./addDAPP";
import SignatureDAPP from "./signatureDAPP";
import React from "react";
import { createRoot } from "react-dom/client";

import { OpenInfo } from "@/types/pageType";
export const showAddDAPPNote = (
  info: OpenInfo,
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
  msg: string | Object,
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