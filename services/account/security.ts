"use client";
import utilHelper from "@/helpers/utilHelper";
import { getDC } from "@/components/auth/login/dc";
import {
  showEncodePassword,
  showSetEncodePassword,
} from "@/components/note/noteHelper";
import type { APPInfo } from "web-dc-api";
import { EncodePasswordInfo } from "@/types/pageType";

// 获取用户加密密码
async function getEncodePwd(
  info: EncodePasswordInfo
): Promise<ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const dc = getDC();
    if (!dc) {
      reject(new Error("dc is null"));
    }
    // todo 显示用户加密密码页面
    const connectingApp: APPInfo | null = dc?.appInfo || null;
    const appInfo = {
      appId: connectingApp?.appId || "",
      appName: connectingApp?.appName || "",
      appIcon: connectingApp?.appIcon || "",
      appUrl: connectingApp?.appUrl || "",
      appVersion: connectingApp?.appVersion || "",
    };
    const handleBack = (userHandleHash: ArrayBuffer | null) => {
      // 处理结果
      resolve(userHandleHash);
    };
    const failBack = () => {
      // 处理结果
      resolve(null);
    };
    showEncodePassword(info, appInfo, handleBack, failBack);
  });
}

// 设置用户加密密码
async function setEncodePwd(
  nftAccount: string
): Promise<[Uint8Array | null, string | null]> {
  return new Promise((resolve) => {
    showSetEncodePassword(
      nftAccount,
      (userHandle: Uint8Array | null, credentialId: string | null) => {
        // 处理结果
        resolve([userHandle, credentialId]);
      }
    );
  });
}

// 使用 Passkey 进行身份验证,并提取出userHandleHash
async function authenticateWithPasskey(credentialId: string) {
  const challenge = window.crypto.getRandomValues(new Uint8Array(32));

  const arrayBuffer = utilHelper.base64UrlToArrayBuffer(credentialId);
  if (!arrayBuffer) {
    return null;
  }
  const publickeyrType: PublicKeyCredentialType = "public-key";
  const required: UserVerificationRequirement = "required";
  const credentialidBuffer = arrayBuffer;
  const getCredentialOptions = {
    challenge: challenge,
    rpId: window.location.hostname,
    allowCredentials: [
      {
        id: credentialidBuffer,
        type: publickeyrType,
      },
    ],
    userVerification: required,
    timeout: 60000,
    extensions: {
      hmacCreateSecret: true,
    },
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: getCredentialOptions,
    });
    if (!assertion) {
      return null;
    }
    // 检查 assertion 中的扩展数据
    const clientExtensionResults = (
      assertion as PublicKeyCredential
    ).getClientExtensionResults();
    console.log("HMAC Secret Used:", clientExtensionResults.hmacCreateSecret);
    console.log("Authentication successful");
    const response = (assertion as PublicKeyCredential)
      .response as AuthenticatorAssertionResponse;
    console.log("response12 successful", response);
    console.log(
      "response.authenticatorData successful",
      new TextDecoder("utf-8").decode(response.authenticatorData)
    );
    console.log(
      "response.clientDataJSON successful",
      new TextDecoder("utf-8").decode(response.clientDataJSON)
    );
    console.log(
      "response.signature successful",
      new TextDecoder().decode(response.signature)
    );
    console.log(
      "response.userHandle successful",
      response.userHandle
        ? new TextDecoder("utf-8").decode(response.userHandle)
        : "没有response.userHandle"
    );
    if (response.userHandle) {
      const userHandleHash = await crypto.subtle.digest(
        "SHA-256",
        response.userHandle
      );
      return userHandleHash;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Authentication failed", error);
    return null;
  }
}

export { getEncodePwd, setEncodePwd, authenticateWithPasskey };
