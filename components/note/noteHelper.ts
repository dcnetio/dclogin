/**
 * 提醒
 */

import AddDAPPNote from "./addDAPP";
import SignatureDAPP from "./signatureDAPP";
import React from "react";
import { createRoot } from "react-dom/client";

import type { APPInfo } from "web-dc-api";
import EncodePassword from "./encodePassword";
import utilHelper from "@/helpers/utilHelper";
import i18n from "@/locales/i18n";
import { EncodePasswordType, MsgStatus } from "@/config/constant";
import NavigationService from "@/lib/navigation";
import { store } from "@/lib/store";
import { updateAuthStep } from "@/lib/slices/authSlice";
import { authenticateWithPasskey } from "@/services/account";
export const showAddDAPPNote = (info: APPInfo, confirmCallback: () => void) => {
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
  info: { iv: Uint8Array; encodeMnimonic: ArrayBuffer; credentialId?: string },
  appInfo: APPInfo,
  confirmCallback: (userHandleHash: ArrayBuffer | null) => void,
  failBack: () => void
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
      cancalFun: () => {
        document.body.removeChild(container);
        window.showToast({
          content: i18n.t("account.unlock_wallet_cancel"),
          position: "bottom",
        });
        failBack();
      },
      confirmFun: async (password: string) => {
        // 确认结束
        console.log("确认EncodePassword=====");
        // 解密
        const userHandle = Buffer.from(password);
        const userHandleHash = await crypto.subtle.digest(
          "SHA-256",
          userHandle
        );
        const mnemonic = await utilHelper.decryptMnemonic(
          info.iv,
          info.encodeMnimonic,
          userHandleHash
        );
        if (!mnemonic) {
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
        failBack();
        document.body.removeChild(container);
      },
      gotoWebAuth: async () => {
        let userHandleHash: ArrayBuffer | null = null;
        if (
          info.credentialId &&
          typeof window.PublicKeyCredential !== "undefined"
        ) {
          store.dispatch(
            updateAuthStep({
              type: MsgStatus.failed,
              content: i18n.t("account.auth_doing"),
            })
          );
          //用户确认后,调出webauthn进行校验,并提取出userHandleHash
          userHandleHash = await authenticateWithPasskey(info.credentialId);
          console.log("userHandleHash success", userHandleHash);
          if (!userHandleHash) {
            window.showToast({
              content: i18n.t("account.unlock_wallet_failed"),
              position: "bottom",
            });
            return;
          }
          confirmCallback(userHandleHash);
          document.body.removeChild(container);
        } else {
          window.showToast({
            content: i18n.t("auth.web_auth_failed"),
            position: "bottom",
          });
        }
      },
    })
  );
};

export const showSetEncodePassword = (
  confirmCallback: (
    userHandle: Uint8Array | null,
    credentialId: string | null
  ) => void
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
      type: EncodePasswordType.SET,
      appInfo: {
        appId: "",
        appName: "",
        appIcon: "",
        appUrl: "",
        appVersion: "",
      },
      confirmFun: async (password: string) => {
        // 确认结束
        console.log("确认EncodePassword=====");
        // 解密
        const userHandle = Buffer.from(password);
        confirmCallback(userHandle, null);
        document.body.removeChild(container);
      },
      onForgotPassword: () => {
        confirmCallback(null, null);
        document.body.removeChild(container);
      },
      gotoWebAuth: async () => {
        let credentialId = "";
        let userHandle: Uint8Array | null = null;
        if (typeof window.PublicKeyCredential !== "undefined") {
          //调用webauthn进行账号信息加密
          const credential = await registerPasskey();
          // 提取 response 对象
          userHandle = credential.userHandle;
          credentialId = credential.id;
          if (!userHandle || !credentialId) {
            window.showToast({
              content: i18n.t("auth.web_auth_failed"),
              position: "bottom",
            });
            return;
          }
          confirmCallback(userHandle, credentialId);
          document.body.removeChild(container);
        } else {
          window.showToast({
            content: i18n.t("auth.web_auth_failed"),
            position: "bottom",
          });
        }
      },
    })
  );
};

// 注册新的 Passkey
async function registerPasskey() {
  const challenge = window.crypto.getRandomValues(new Uint8Array(32));
  //生成可识别的时间戳:格式为2021-01-01 12:00:00
  const timestamp = new Date().toLocaleString("en-GB", { timeZone: "UTC" });
  const userHandle = crypto.getRandomValues(new Uint8Array(32));
  const publickeyrType: PublicKeyCredentialType = "public-key";
  const required: UserVerificationRequirement = "required";
  const asstention: AttestationConveyancePreference = "direct";
  const platformAttachment: AuthenticatorAttachment = "platform";
  const createCredentialOptions = {
    challenge: challenge,
    rp: {
      name: "DCWallet",
      id: window.location.hostname,
    },
    user: {
      id: userHandle,
      name: timestamp,
      displayName: timestamp,
    },
    pubKeyCredParams: [{ alg: -7, type: publickeyrType }],
    authenticatorSelection: {
      authenticatorAttachment: platformAttachment,
      userVerification: required,
    },
    timeout: 60000,
    attestation: asstention,
    extensions: {
      hmacCreateSecret: true,
    },
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: createCredentialOptions,
    });
    if (!credential) {
      throw new Error("Passkey registration failed");
    }
    const extensionResults = (
      credential as PublicKeyCredential
    ).getClientExtensionResults();
    console.log("HMAC Secret Used:", extensionResults.hmacCreateSecret);
    return { id: credential?.id, userHandle: userHandle };
  } catch (error) {
    console.error("Passkey registration failed", error);
    // throw error;
    return { id: "", userHandle: null };
  }
}
