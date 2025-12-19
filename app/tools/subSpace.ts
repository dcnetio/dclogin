/**
 * 空间订阅相关
 *
 */
import { getDC } from "@/components/auth/login/dc";
import { ERROR_CODE } from "@/config/constant";
import { apiUrl } from "@/config/define";
import i18n from "@/locales/i18n";

import { Ed25519PubKey } from "web-dc-api";
/**
 * Apply for free storage space for new users
 * @returns Promise resolving to [success, error]
 */
export async function applyFreeSpace(
  pubKey: Ed25519PubKey
): Promise<[boolean, Error | null]> {
  const dc = getDC();
  if (!dc) {
    return [false, new Error("Wallet not connected")];
  }
  // Get public key for request
  if (!pubKey) {
    return [false, new Error("User public key not available")];
  }
  try {
    // Check if this is a new account without space
    const [userInfo] = await dc.auth.getUserInfoWithAccount(
      "0x" + pubKey.toString()
    );
    if (userInfo && userInfo.subscribeSpace > 0) {
      return [false, new Error(i18n.t("storage.has_space"))];
    }

    // Make request to storage service
    // Use a fallback for browsers that don't support navigator.language
    const lang = i18n.language || "en";

    // Use native fetch with proper error handling
    try {
      const response = await fetch(`${apiUrl}/storage/give`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          account: "0x" + pubKey.toString() || "",
          address: pubKey.toBase58() || "",
          lang: lang,
        }),
      });

      // Handle network errors
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        return [
          false,
          new Error(
            `Failed to request free space: ${response.status} ${errorText}`
          ),
        ];
      }

      // Parse JSON safely
      let result;
      try {
        result = await response.json();
      } catch (jsonError: any) {
        return [
          false,
          new Error("Invalid response format: " + jsonError.message),
        ];
      }

      if (!result || (result.msg && result.msg !== "已经获取")) {
        let msg = "";
        if (result.data === ERROR_CODE.RECEIVE_DOING) {
          msg = i18n.t("storage.receive_doing");
        } else if (result.data === ERROR_CODE.HAS_RECEIVED) {
          msg = i18n.t("storage.has_received");
        } else if (result.data === ERROR_CODE.GIVE_OUT_LIMIT) {
          msg = i18n.t("storage.give_out_limit");
        } else {
          msg = i18n.t("storage.failed");
        }
        return [false, new Error(msg)];
      }

      // Check if storage was actually allocated
      // Wait for blockchain confirmation (max 30 seconds)
      const lastExpire = 0;
      const lastSubscribeSize = 0;

      // Verify subscription was successful
      const subscribeSuccess = await checkSubscription(
        pubKey,
        lastExpire,
        lastSubscribeSize
      );

      return subscribeSuccess
        ? [true, null]
        : [false, new Error(i18n.t("storage.time_out"))];
    } catch (fetchError: any) {
      return [
        false,
        new Error(
          `Network error: ${
            fetchError.message || "Failed to connect to server"
          }`
        ),
      ];
    }
  } catch (error) {
    console.error("Error applying for free space:", error);
    return [false, error instanceof Error ? error : new Error(String(error))];
  }
}

/**
 * Check if subscription was successful by polling user info
 * @param lastExpire Previous expiration time
 * @param lastSubscribeSize Previous subscription size
 * @returns Promise resolving to boolean indicating success
 */
async function checkSubscription(
  publicKey: Ed25519PubKey,
  lastExpire: number,
  lastSubscribeSize: number
): Promise<boolean> {
  const maxAttempts = 30; // Try for ~30 seconds
  const dc = getDC();
  if (!dc) {
    return false;
  }
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Get updated user info
      const [userInfo, err] = await dc.auth?.getUserInfoWithAccount(
        "0x" + publicKey.toString()
      );

      if (!err && userInfo) {
        // Check if either expiration time or space has increased
        if (
          Math.abs(Number(userInfo.expireNumber) - lastExpire) >
            2 * 60 * 60 * 24 || // ~2 days difference
          Math.abs(Number(userInfo.subscribeSpace) - lastSubscribeSize) > 10000 // ~10MB difference
        ) {
          return true;
        }
      }
    } catch (err) {
      console.warn("Error checking subscription:", err);
    }
    // Wait 1 second before next check
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return false;
}
