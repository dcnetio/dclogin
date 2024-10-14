/**
 * 工具
 */
"use client";
function _hexToUint8Array(hex:string) {  
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

const utilHelper = {
    hexToUint8Array: _hexToUint8Array,
    base64UrlToArrayBuffer: _base64UrlToArrayBuffer,
    };

export default utilHelper;
  
