/**
 * 链节点交互
 */
// Import everything
import { ethers, Wallet, WebSocketProvider} from "ethers";

let provider: ethers.WebSocketProvider;
let signer: ethers.JsonRpcSigner;
let wallet: ethers.HDNodeWallet;

// 连接
const connectEth = async (url: string) => {
  try {
    provider = new WebSocketProvider(url);
    console.log('connectEth success', provider);
    return true;
  } catch (error) {
    console.log('connectEth error', error);
    return false;
  }
};

// 创建钱包
const createWallet = async () => {
  // wallet 创建包，助记词，私钥，地址
  wallet = Wallet.createRandom();
  console.log('===============wallet', wallet);
  console.log('===============wallet.mnemonic', wallet.mnemonic);
  console.log('===============wallet.privateKey', wallet.privateKey);
  console.log('===============wallet.address', wallet.address);
  return wallet;
};

// 创建钱包，助记词
const createWalletByMnemonic = async (mnemonic: string) => {
  wallet = Wallet.fromPhrase(mnemonic);
  console.log('===============wallet', wallet);
  console.log('===============wallet.mnemonic', wallet.mnemonic);
  console.log('===============wallet.privateKey', wallet.privateKey);
  console.log('===============wallet.address', wallet.address);
}


// 获取当前区块高度
const getBlockNumber = async () => {
  if (provider) {
    const blockNumber = await provider.getBlockNumber();
    return blockNumber;
  } else {
    return null;
  }
};

// 获取用户的余额
const getUserBlance = async () => {
  if (provider && wallet) {
    const balance = await provider.getBalance(wallet.address);
    console.log('===============getUserBlance balance', balance);
    return balance.toString()
    ;
  } else {
    return null;
  }
};

// 转账
const transfer = async (to: string, amount: string) => {
  if (provider) {
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


export default {
  connectEth,
  createWallet,
  createWalletByMnemonic,
  getBlockNumber,
  getUserBlance,
  transfer,
};

