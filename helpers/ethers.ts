/**
 * 链节点交互
 */
// Import everything
import { ethers, Wallet } from "ethers";

let provider: ethers.JsonRpcProvider;
let signer: ethers.Signer;
let wallet: ethers.HDNodeWallet;

// 连接
const connectEth = async (url: string) => {
  provider = new ethers.JsonRpcProvider(url);
  signer = await provider.getSigner();
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
const getUserBlance = async (address: string) => {
  if (provider) {
    const balance = await provider.getBalance(address);
    return balance;
  } else {
    return null;
  }
};

// 转账
const transfer = async (to: string, amount: string) => {
  if (provider) {
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amount),
    });
    // Often you may wish to wait until the transaction is mined
    const receipt = await tx.wait();
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

