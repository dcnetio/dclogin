/**
 * 工具
 */
"use client";
function _hexToUint8Array(hex:string): Uint8Array {
  // 如果十六进制字符串以 "0x" 开头，则去掉这个前缀  
  if (hex.startsWith("0x")) {  
      hex = hex.slice(2);  
  }  

  // 确保十六进制字符串长度是偶数  
  if (hex.length % 2 !== 0) {  
      throw new Error("Invalid hex string");  
  }  

  // 创建 Uint8Array  
  const byteArray = new Uint8Array(hex.length / 2);  

  // 遍历十六进制字符串，每两个字符转换为一个字节  
  for (let i = 0; i < hex.length; i += 2) {  
      const byte = hex.substr(i, 2);  
      byteArray[i / 2] = parseInt(byte, 16);  
  }  

  return byteArray;  
}  


function _base64UrlToArrayBuffer(base64Url:string) {  
    // 将 Base64URL 字符串转换为标准 Base64 字符串  
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');  

    // 添加填充字符，使长度为 4 的倍数  
    while (base64.length % 4 !== 0) {  
        base64 += '=';  
    }  

    try {  
        // 使用 atob 解码为二进制字符串  
        const binaryString = window.atob(base64);  
        const len = binaryString.length;  
        const bytes = new Uint8Array(len);  
        for (let i = 0; i < len; i++) {  
            bytes[i] = binaryString.charCodeAt(i);  
        }  
        return bytes.buffer;  
    } catch (error) {  
        console.error('Failed to decode Base64URL string:', error);  
        return null;  
    }  
}  

async function importAesKeyFromHash (userHandleHash: ArrayBuffer) {
    // Convert the userHandleHash (32-byte) into a CryptoKey object
    return await crypto.subtle.importKey(
      "raw", // Raw format of the key
      userHandleHash, // The ArrayBuffer or TypedArray
      { name: "AES-GCM" }, // Algorithm to use for the key
      false, // Not extractable
      ["encrypt", "decrypt"] // Key usages
    );
  }
  
 // 加密助记词
async function _encryptMnemonic (iv: Uint8Array, mnemonic: string, userHandleHash: ArrayBuffer): Promise<ArrayBuffer| null> {
  //解密出助记词
  try {
    const cryptoKey = await importAesKeyFromHash(userHandleHash);
    const encryptedMnemonic = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      cryptoKey,
      new TextEncoder().encode(mnemonic)
    );
    
    return encryptedMnemonic;
  } catch (error) {
    return null;
  }
}

 // 解密助记词
async function _decryptMnemonic (iv: Uint8Array, encryptedMnemonic: ArrayBuffer, userHandleHash: ArrayBuffer): Promise<string> {
  //解密出助记词
  try {
    const cryptoKey = await importAesKeyFromHash(userHandleHash);
    const encodedMnemonic = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      cryptoKey,
      encryptedMnemonic
    );
    const decoder = new TextDecoder();
    const mnemonic = decoder.decode(encodedMnemonic);
    return mnemonic;
  } catch (error) {
    return '';
  }
}

const utilHelper = {
    hexToUint8Array: _hexToUint8Array,
    base64UrlToArrayBuffer: _base64UrlToArrayBuffer,
    encryptMnemonic: _encryptMnemonic,
    decryptMnemonic: _decryptMnemonic
    };

export default utilHelper;
  
