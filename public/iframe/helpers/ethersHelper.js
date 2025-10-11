/**
 * 链节点交互
 */
// Import everything
import { ethers } from "https://esm.sh/ethers@6.15.0";



// Function to verify the signature  message:要签名的消息，signature:签名,16进制，expectedAddress:预期的签名者地址
const verifySignature = (
  message,
  signature,
  expectedAddress
) => {
  // Hash the message
  const messageHash = ethers.hashMessage(message);

  // Recover the address from the signature
  const recoveredAddress = ethers.recoverAddress(messageHash, signature);

  // Compare the recovered address with the expected address
  if (recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()) {
    console.log("Signature is valid and matches the expected address.");
    return true;
  } else {
    console.log("Signature is invalid or does not match the expected address.");
    return false;
  }
};

/**
 * 验证 EIP-712 签名
 * @param {string} primaryType - 主类型名称
 * @param {object} domain - 域信息
 * @param {object} types - 类型定义集合
 * @param {object} message - 要验证的消息数据
 * @param {string} signature - 签名
 * @param {string} expectedAddress - 预期的签名者地址
 * @returns {boolean} - 签名是否有效
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyEIP712Signature = (
  primaryType,
  domain,
  types,
  message,
  signature,
  expectedAddress
) => {
  // 计算域分隔符
  const domainSeparator = ethers.TypedDataEncoder.hashDomain(domain);

  // 计算结构化数据的哈希值
  const hashStruct = ethers.TypedDataEncoder.hashStruct(
    primaryType,
    types,
    message
  );

  // 生成最终的哈希值
  const digest = ethers.keccak256(
    ethers.solidityPacked(
      ["string", "bytes32", "bytes32"],
      ["\x19\x01", domainSeparator, hashStruct]
    )
  );
  // Hash the message
  const messageHash = ethers.hashMessage(digest);
  // 从签名中恢复地址
  const recoveredAddress = ethers.recoverAddress(messageHash, signature);
  // 比较恢复的地址与预期地址
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
};


const ethersHelper = {
  verifySignature,
  verifyEIP712Signature,
};
export default ethersHelper;
