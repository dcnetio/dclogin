/**
 * 空间订阅相关
 * 
 */
import i18n from '@/locales/i18n';
import { AccountError } from '../../../dcapi/lib/implements/account/manager';

/**
 * Apply for free storage space for new users
 * @returns Promise resolving to [success, error]
 */
export async function applyFreeSpace(publicKey: string): Promise<[boolean, Error | null]> {
    if(!globalThis.dc) {
      return [false, new AccountError("Wallet not connected")]
    }
  try {
    // Check if this is a new account without space
    const userInfo = await globalThis.dc.auth.getUserInfoWithAccount(publicKey);
    if (userInfo && userInfo.subscribeSpace > 0) {
      return [false, new AccountError("User already has space")];
    }
    
    // Get public key for request
    const pubKey =  globalThis.dc.getPublicKey();
    if (!pubKey) {
      return [false, new AccountError("User public key not available")];
    }
    
    // Make request to storage service
    // Use a fallback for browsers that don't support navigator.language
    const lang = i18n.language || (navigator.language ? navigator.language : 'en');
    
    // Use native fetch with proper error handling
    try {
      const response = await fetch(`storage/give`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          account: pubKey.toString() || '',
          address: pubKey.toBase58() || '',
          lang: lang
        })
      });
      
      // Handle network errors
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        return [false, new AccountError(`Failed to request free space: ${response.status} ${errorText}`)];
      }
      
      // Parse JSON safely
      let result;
      try {
        result = await response.json();
      } catch (jsonError: any) {
        return [false, new AccountError("Invalid response format: " + jsonError.message)];
      }
      
      if (!result || result.error) {
        return [false, new AccountError("Storage giving error: " + (result?.error || "Unknown error"))];
      }
      
      // Check if storage was actually allocated
      // Wait for blockchain confirmation (max 30 seconds)
      const lastExpire = userInfo?.expireNumber || 0;
      const lastSubscribeSize = userInfo?.subscribeSpace || 0;
      
      // Verify subscription was successful
      const subscribeSuccess = await checkSubscription(lastExpire, lastSubscribeSize);
      
      return subscribeSuccess ? [true, null] : [false, new AccountError("Storage allocation timed out")];
      
    } catch (fetchError: any) {
      return [false, new AccountError(`Network error: ${fetchError.message || "Failed to connect to server"}`)];
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
  lastExpire: number, 
  lastSubscribeSize: number
): Promise<boolean> {
  const maxAttempts = 30; // Try for ~30 seconds
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Get updated user info
      const userInfo = await globalThis.dc.dcChain?.getUserInfoWithAccount(
       "0x" + globalThis.dc.publicKey.toString()
      );
      
      if (!userInfo) continue;
      
      // Check if either expiration time or space has increased
      if (
        Math.abs(Number(userInfo.expireNumber) - lastExpire) > 2 * 60 * 60 * 24 || // ~2 days difference
        Math.abs(Number(userInfo.subscribeSpace) - lastSubscribeSize) > 10000 // ~10MB difference
      ) {
        return true;
      }
    } catch (err) {
      console.warn("Error checking subscription:", err);
    }
    // Wait 1 second before next check
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return false; 
}