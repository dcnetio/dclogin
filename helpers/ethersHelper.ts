/**
 * 链节点交互
 */
// Import everything
import { ethers, Wallet, WebSocketProvider,JsonRpcProvider} from "ethers";


let wssProvider: ethers.WebSocketProvider | null = null;
let jsonRpcProvider: ethers.JsonRpcProvider | null = null;
let wallet: ethers.HDNodeWallet;

// websocket连接区块链
const connectChainWithWss = async (url: string) => {
  try {
    wssProvider = new WebSocketProvider(url);
    console.log('connectChainWithWss success,url: ', url);
    jsonRpcProvider = null;
    return true;
  } catch (error) {
    wssProvider = null;
    console.log('connectChainWithWss error', error);
    return false;
  }
};

const connectWithHttps = async (url: string) => {
  try {
    jsonRpcProvider = new JsonRpcProvider(url);
    console.log('connectChainWithWss success,url: ', url);
    wssProvider = null;
    return true;
  } catch (error) {
    jsonRpcProvider = null;
    console.log('connectChainWithWss error', error);
    return false;
  }
}

// 创建钱包账号
const createWalletAccount = async () => {
  // wallet 创建包，助记词，私钥，地址
  wallet = Wallet.createRandom();
  console.log('===============wallet', wallet);
  console.log('===============wallet.mnemonic', wallet.mnemonic);
  console.log('===============wallet.privateKey', wallet.privateKey);
  console.log('===============wallet.address', wallet.address);
  return wallet;
};

// 根据助记词生成钱包账号
const createWalletAccountByMnemonic = async (mnemonic: string) => {
  wallet = Wallet.fromPhrase(mnemonic);
  console.log('===============wallet', wallet);
  console.log('===============wallet.mnemonic', wallet.mnemonic);
  console.log('===============wallet.privateKey', wallet.privateKey);
  console.log('===============wallet.address', wallet.address);
}


// 获取当前区块高度
const getBlockNumber = async () => {
  if (wssProvider) {
    const blockNumber = await wssProvider.getBlockNumber();
    return blockNumber;
  }else if(jsonRpcProvider){
    const blockNumber = await jsonRpcProvider.getBlockNumber();
    return blockNumber;
  } else {
    return null;
  }
};

// 获取用户的余额
const getUserBlance = async () => {
  if ( wallet) {
    if (wssProvider) {
       const balance = await wssProvider.getBalance(wallet.address);
      console.log('===============getUserBlance balance', balance);
       return balance.toString()
    }else if(jsonRpcProvider){
      const balance = await jsonRpcProvider.getBalance(wallet.address);
      console.log('===============getUserBlance balance', balance);
      return balance.toString()
    }
    
    ;
  } else {
    return null;
  }
};

// 转账
const transfer = async (to: string, amount: string) => {
  if (wssProvider || jsonRpcProvider) {
    const tx = await wallet.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    });
    console.log('===============tx', tx);
    // Often you may wish to wait until the transaction is mined
    const receipt = await tx.wait();
    console.log('===============receipt', tx);
    return receipt;
  } else {
    return null;
  }
};


// Function to verify the signature  message:要签名的消息，signature:签名,16进制，expectedAddress:预期的签名者地址
const verifySignature = async (message: Uint8Array|string, signature: string, expectedAddress:string) => {  
  // Hash the message  
  const messageHash = ethers.hashMessage(message);  

  // Recover the address from the signature  
  const recoveredAddress = ethers.recoverAddress(messageHash, signature);  

  // Compare the recovered address with the expected address  
  if (recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()) {  
      console.log("Signature is valid and matches the expected address.");  
  } else {  
      console.log("Signature is invalid or does not match the expected address.");  
  }  
}


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
const verifyEIP712Signature = async (primaryType:string, domain:object, types:object, message:object, signature:string, expectedAddress:string) => {  
  // 计算域分隔符  
  const domainSeparator = ethers.TypedDataEncoder.hashDomain(domain);  

  // 计算结构化数据的哈希值  
  const hashStruct = ethers.TypedDataEncoder.hashStruct(primaryType, types, message);  

  // 生成最终的哈希值  
  const digest = ethers.utils.keccak256(  
      ethers.utils.solidityPack(  
          ["string", "bytes32", "bytes32"],  
          ["\x19\x01", domainSeparator, hashStruct]  
      )  
  );  

  // 从签名中恢复地址  
  const recoveredAddress = ethers.utils.recoverAddress(digest, signature);  

  // 比较恢复的地址与预期地址  
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();  
}  


const ethersHelper = {
  connectChainWithWss,
  connectWithHttps,
  createWalletAccount,
  createWalletAccountByMnemonic,
  getBlockNumber,
  getUserBlance,
  transfer,
  verifySignature
};
export default  ethersHelper;

