/**
 * 提醒
 */

import AddDAPPNote from "@/components/note/addDAPP";
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
      confirmAdd: () => {
        document.body.removeChild(container);
        // 确认结束
        console.log("确认结束=====");
        confirmCallback();
      },
    })
  );
};
