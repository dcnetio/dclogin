"use client";
import utilHelper from "@/helpers/utilHelper";
import ethersHelper from "@/helpers/ethersHelper";
import { defaultNetworks } from "@/context/constant";
import {
  ChainInfo,
  ConnectReqMessage,
  SignReqMessage,
  EIP712SignReqMessage,
  isConnectReqMessage,
  isSignReqMessage,
  isEIP712SignReqMessage,
  AccountInfo,
} from "../types/walletTypes";

// 定义一个变量，用于存储BroadcastChannel对象
const version = "v0_0_1";
let currentChain: ChainInfo | null = null; //当前网络
let currentAccount: AccountInfo | null = null; //当前账号

// 数据库
import DBHelper from "@/helpers/DBHelper";

// 获取查询字符串
let queryString = "";
if (typeof window !== "undefined") {
  queryString = window.location.search;
}
const urlParams = new URLSearchParams(queryString);
const location = urlParams.get("origin");
const openerOrigin = location;

const NetworkStauts = Object.freeze({
  connecting: 0,
  connected: 1,
  disconnect: 2,
});
let networkStatus: number = NetworkStauts.disconnect; //网络状态

/*******************************初始化需要完成操作***********************************/

// 监听DAPP窗口发送的消息;
if (typeof window !== "undefined") {
  window.addEventListener("message", function (event) {
    //判断消息来源
    if (event.origin !== openerOrigin) {
      return;
    }
    onDAPPMessage(event);
  });
}

//初始化网络列表,并连接最近切换的网络
async function _initNetworks() {
  try {
    const chains = await DBHelper.getAllData(DBHelper.store_chain);
    if (chains.length == 0) {
      for (let i = 0; i < defaultNetworks.networks.length; i++) {
        await DBHelper.addData(
          DBHelper.store_chain,
          defaultNetworks.networks[i]
        );
      }
    }
  } catch (e) {
    console.error("初始化网络列表失败:", e);
  }
  if (currentChain == null) {
    //从数据库中获取第一个网络信息
    const chains = await DBHelper.getAllData(DBHelper.store_chain);
    if (chains.length > 0) {
      currentChain = chains[0];
      if (currentChain) {
        //连接网络
        const flag = await ethersHelper.connectWithHttps(currentChain.rpcUrl);
        if (!flag) {
          networkStatus = NetworkStauts.disconnect;
        } else {
          // 设置初始化账户信息+网络信息{key:"chosedAccount",value"aaaaa"}
          await DBHelper.addData(DBHelper.store_keyinfo, {
            key: "connectedChain",
            value: currentChain,
          });
          networkStatus = NetworkStauts.connected;
        }
      }
    }
  }
  if (currentAccount == null) {
    //从数据库中获取第一个账号信息
    const accounts = await DBHelper.getAllData(DBHelper.store_account);
    if (accounts.length > 0) {
      currentAccount = accounts[0];
    }
  }
}

// 初始化基本信息(初始化网络为最近切换的网络,账号为最近切换的账号)
async function _initBaseinfo() {
  try {
    if (currentChain == null) {
      //从数据库中获取上次打开的网络信息
      const netinfo = await DBHelper.getData(
        DBHelper.store_keyinfo,
        "connectedChain"
      );
      if (netinfo && netinfo.value) {
        currentChain = netinfo.value;
        //连接网络
        const flag = await ethersHelper.connectWithHttps(netinfo.value.rpcUrl);
        if (!flag) {
          networkStatus = NetworkStauts.disconnect;
        } else {
          networkStatus = NetworkStauts.connected;
        }
      }
    }
    if (currentAccount == null) {
      //从数据库中获取上次打开的账号信息
      const accountinfo = await DBHelper.getData(
        DBHelper.store_keyinfo,
        "chosedAccount"
      );
      if (accountinfo && accountinfo.value) {
        currentAccount = accountinfo.value;
      }
    }
  } catch (e) {
    console.error("获取网络信息失败:", e);
  }
}

//启动定时器,定时检查网络状态,如果网络状态为断开,则重新连接
let checkCount = 0;
setInterval(async () => {
  if (networkStatus != NetworkStauts.connected) {
    //如果网络状态为断开,则m每秒检查一次网络状态
    const flag = await ethersHelper.checkNetworkStatus();
    if (flag) {
      networkStatus = NetworkStauts.connected;
      checkCount = 0;
    }
  } else {
    checkCount++;
    if (checkCount > 10) {
      //每10秒检查一次网络状态
      const flag = await ethersHelper.checkNetworkStatus();
      if (flag) {
        networkStatus = NetworkStauts.connected;
      } else {
        networkStatus = NetworkStauts.disconnect;
      }
      checkCount = 0;
    }
  }
}, 1000);

// 通知DAPP,钱包加载完成
function _initCommChannel() {
  //通知DAPP,钱包加载完成
  const message = {
    type: "walletLoaded",
    data: {
      origin: window.location.origin,
    },
  };
  if (window.opener) {
    window.opener.postMessage(message, openerOrigin);
  }
}

// 来自DAPP的消息处理
function onDAPPMessage(event: MessageEvent) {
  let message = null;
  // 对消息进行json解析
  message = event.data;
  if (!message) {
    return;
  }
  if (event.ports.length == 0) {
    return;
  }
  if (message.version !== version) {
    //判断版本号
    return;
  }
  if (message.origin != openerOrigin) {
    //判断消息来源
    return;
  }
  //判断消息类型,message格式为{type: 'getUserInfo', data: {}}
  switch (message.type) {
    case "checkWalletLoaded": //检查钱包是否加载完成请求
      const sendMessage = {
        type: "walletLoaded",
        data: {
          origin: window.location.origin,
        },
      };
      event.ports[0].postMessage(sendMessage); //利用messageChannel通知页面加载完成,当浏览器不支持window.opener会走这个流程
      break;
    case "connect": //连接钱包请求
      if (isConnectReqMessage(message)) {
        _connectCmdHandler(message, true, event.ports[0]);
      }
      break;
    case "signMessage": //签名请求
      if (isSignReqMessage(message)) {
        signMessageHandler(message, event.ports[0]);
      }
      break;
    case "signEIP712Message": //签名EIP712请求
      if (isEIP712SignReqMessage(message)) {
        signEIP712MessageHandler(message, event.ports[0]);
      }
      break;
    default:
      break;
  }
}

// 判断是否已经有账号,如果没有,则创建账号
async function checkAccountAndCreate() {
  if (currentAccount) {
    return currentAccount;
  }
  let accounts = [];
  try {
    //判断用户是否已经创建过钱包账号,如果没有,则跳出状态等待框,提示用户账号创建中
    accounts = await DBHelper.getAllData(DBHelper.store_account);
    if (!accounts) {
      accounts = [];
    }
    if (accounts.length === 0) {
      //todo 跳出状态等待框,提示用户账号创建中
      const account = await createWalletAccount();
      //todo 关闭状态等待框
      if (!account) {
        //todo 跳出提示框,提示用户创建账号失败
        return;
      }
      //todo 跳出账号创建成功提示框
      accounts.push(account);
    }
  } catch (e) {
    console.error("获取账号信息失败:", e);
    //todo 跳出提示框,提示用户创建账号失败
    return;
  }
  if (accounts.length > 1) {
    //todo 跳出选择账号框,让用户选择账号
    return;
  }
  await DBHelper.addData(DBHelper.store_keyinfo, {
    key: "chosedAccount",
    value: accounts[0],
  });
  currentAccount = accounts[0]; // 赋值
  return accounts[0];
}

// 收到连接钱包请求处理,message格式为{version:'v0_0_1',type: 'connect',data: {appname:'test',appIcon:'',appUrl: 'http://localhost:8080',appVersion: '1.0.0'}}
async function _connectCmdHandler(
  message: ConnectReqMessage,
  bool: boolean,
  port: MessagePort | null = null
) {
  const connectingApp = message.data;
  const choseedAccount = await checkAccountAndCreate();
  // 取出网络列表
  let chains = [];
  try {
    chains = await DBHelper.getAllData(DBHelper.store_chain);
  } catch (e) {
    console.error("获取网络信息失败:", e);
    //todo 跳出提示框,提示用户获取网络信息失败
    return;
  }
  if (currentChain == null) {
    //如果当前网络为空,则取第一个网络
    currentChain = {
      chainId: chains[0].chainId,
      name: chains[0].name,
      rpcUrl: chains[0].rpcUrl,
      desc: chains[0].desc,
      confirms: chains[0].confirms, //确认数
      currencySymbol: chains[0].currencySymbol,
    };
  }
  const jsonRpcProvider = ethersHelper.getProvider();
  if (jsonRpcProvider != null) {
    // 获取网络信息
    const network = await jsonRpcProvider.getNetwork();
    const chanId = Number(network.chainId);
    if (chanId != currentChain.chainId) {
      const providerChainId = chanId;
      // 将jsonRpcProvider网络切换到当前网络
      for (let i = 0; i < chains.length; i++) {
        if (chains[i].chainId == providerChainId) {
          currentChain = {
            chainId: chains[i].chainId,
            name: chains[i].name,
            rpcUrl: chains[i].rpcUrl,
            desc: chains[i].desc,
            confirms: chains[i].confirms, //确认数
            currencySymbol: chains[i].currencySymbol,
          };
          break;
        }
      }
    }
  }
  //todo 异步获取当前网络状态,更新钱包网络状态

  //todo 账号存在后,跳出授权框,提示用户授权连接对应的APP(这个界面可以切换网络)

  //用户确认后,调出webauthn进行校验,并提取出userHandleHash
  const userHandleHash = await authenticateWithPasskey(
    choseedAccount.credentialId
  );
  console.log("userHandleHash success", userHandleHash);
  if (!userHandleHash) {
    //todo 跳出提示框,提示用户授权失败
    if (bool) {
      // DAPP进入
      // 关闭当前窗口,并返回原来的窗口
      if (window.opener) {
        // 可以在原窗口中执行一些操作，例如导航
        window.opener.focus(); // 返回并聚焦到原窗口
      }
      window.close();
    }
    return;
  }
  //解密出助记词
  const cryptoKey = await importAesKeyFromHash(userHandleHash);
  console.log("cryptoKey success", cryptoKey);
  const encodedMnemonic = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: choseedAccount.iv,
    },
    cryptoKey,
    choseedAccount.mnemonic
  );
  console.log("encodedMnemonic success", encodedMnemonic);
  const decoder = new TextDecoder();
  const mnemonic = decoder.decode(encodedMnemonic);
  console.log("mnemonic success", mnemonic);
  // 通过助记词导入钱包,生成带私钥钱包账号
  const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
  console.log("wallet success", wallet);
  if (!wallet) {
    //todo 跳出提示框,提示用户导入钱包失败
    return;
  }
  // 执行签名
  const signature = await ethersHelper.signMessage(wallet, message.origin);
  console.log("signature success", signature);
  if (!signature) {
    //todo 跳出提示框,提示用户签名失败
    return;
  }
  if (bool) {
    // DCAPP进入
    //签名成功后,发送链接成功消息给APP
    const resMessage = {
      version: version,
      type: "connected",
      origin: origin,
      data: {
        success: true,
        account: wallet.address,
        chainId: currentChain.chainId,
        chainName: currentChain.name,
        signature: signature,
      },
    };
    if (!port) {
      console.error("messagePort is null");
      // 关闭当前窗口,并返回原来的窗口
      if (window.opener) {
        // 可以在原窗口中执行一些操作，例如导航
        window.opener.focus(); // 返回并聚焦到原窗口
      }
      window.close();
      return;
    }
    port.postMessage(resMessage);
    // 1秒后关闭port
    setTimeout(() => {
      port.close();
    }, 1000);
    // 连接记录存储到数据库
    const app = {
      appName: connectingApp?.appName,
      appIcon: connectingApp?.appIcon,
      appUrl: connectingApp?.appUrl,
      appVersion: connectingApp?.appVersion,
      timestamp: new Date().getTime(),
    };
    DBHelper.updateData(DBHelper.store_apps, app)
      .then(() => {
        console.log("连接记录存储成功");
      })
      .catch((e) => {
        console.error("连接记录存储失败:", e);
      })
      .finally(() => {
        // 关闭当前窗口,并返回原来的窗口
        if (window.opener) {
          // 可以在原窗口中执行一些操作，例如导航
          window.opener.focus(); // 返回并聚焦到原窗口
        }
        window.close();
      });
  } else {
    // 钱包本身访问
    return {
      success: true,
      account: wallet.address,
      chainId: currentChain.chainId,
      name: currentChain.name,
      signature: signature,
    };
  }
}

// 根据账号,生成签名的钱包账号对象
async function generateWalletAccount(seedAccount: string) {
  let account = null;
  // 数据库里获取账号信息
  try {
    account = await DBHelper.getData(DBHelper.store_account, seedAccount);
    if (account == null) {
      //todo 跳出提示框,提示钱包里的用户账号不存在
      return null;
    }
  } catch (e) {
    console.error("获取账号信息失败:", e);
    //todo 跳出提示框,提示用户获取账号信息失败
    return null;
  }
  //todo 跳出授权框,提示用户进行签名(显示所有签名信息,以及签名申请的APP信息)
  //用户确认后,调出webauthn进行校验,并提取出userHandleHash
  const userHandleHash = await authenticateWithPasskey(account.credentialId);
  if (!userHandleHash) {
    //todo 跳出提示框,提示用户授权失败
    return null;
  }
  //解密出助记词
  const cryptoKey = await importAesKeyFromHash(userHandleHash);
  const encodedMnemonic = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: account.iv,
    },
    cryptoKey,
    account.mnemonic
  );
  const decoder = new TextDecoder();
  const mnemonic = decoder.decode(encodedMnemonic);
  // 通过助记词导入钱包,生成带私钥钱包账号
  const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
  if (!wallet) {
    //todo 跳出提示框,提示用户导入钱包失败
  }
  return wallet;
}

/** 收到签名请求处理,message格式为
{
    version:'v0_0_1',
    type: 'signMessage', 
    origin: 'http://localhost:8080',
    data: {
            account: '0x1234567890123456789012345678901234567890',
            appName:'test',
            appIcon:'',
            appUrl: 'http://localhost:8080',
            appVersion: '1.0.0',
            messageType: 'string',//string,hex
            message: 'test message',
        }
}
**/
async function signMessageHandler(
  message: SignReqMessage,
  port: MessagePort | null = null
) {
  const data = message.data;
  if (data.account == null) {
    //没有签名账号,不做处理
    return;
  }
  const wallet = await generateWalletAccount(data.account);
  if (!wallet) {
    return;
  }
  let signature = null;
  if (data.messageType == "hex") {
    const waitSignMessage = utilHelper.hexToUint8Array(data.message);
    // 执行签名
    signature = await ethersHelper.signMessage(wallet, waitSignMessage);
    if (!signature) {
      //todo 跳出提示框,提示用户签名失败
      return;
    }
  } else {
    // 执行签名
    signature = await ethersHelper.signMessage(wallet, data.message);
    if (!signature) {
      //todo 跳出提示框,提示用户签名失败
      return;
    }
  }

  //签名成功后,发送签名成功消息给APP,并返回签名结果
  const resMessage = {
    version: version,
    type: "signSuccess",
    origin: origin,
    data: {
      success: true,
      account: wallet.address,
      chainId: currentChain?.chainId,
      chainName: currentChain?.name,
      signature: signature,
    },
  };
  if (port) {
    port.postMessage(resMessage);
    // 1秒后关闭port
    setTimeout(() => {
      port.close();
    }, 1000);
  }
  // 关闭当前窗口,并返回原来的窗口
  if (window.opener) {
    // 可以在原窗口中执行一些操作，例如导航
    window.opener.focus(); // 返回并聚焦到原窗口
  }
  window.close();
}

//收到签名EIP712请求处理,message格式为
// {
//     code: 'CxzQW5n8k0',
//     version:'v0_0_1',
//     type: 'signEIP712Message',
//     data: {
//             appname:'test',
//             appIcon:'',
//             appUrl: 'http://localhost:8080',
//             appVersion: '1.0.0',
//             domain: {
//                 name: 'Test',
//                 version: '1.0.0',
//                 chainId: 1,
//                 verifyingContract: '0x1234567890123456789012345678901234567890',
//
//             },
//             types: {
//                 Person: [
//                     { name: 'name', type: 'string' },
//                     { name: 'wallet', type: 'address' }
//                 ],
//                 Mail: [
//                     { name: 'from', type: 'Person' },
//                     { name: 'to', type: 'Person' },
//                     { name: 'contents', type: 'string' }
//                 ],
//             },
//             message: {
//                 from: {
//                     name: 'Cow',
//                     wallet: '',
//                 },
//                 to: {
//                     name: 'Bob',
//                     wallet: '0xbBbBBBBbb',
//                 },
//                 contents: 'Hello, Bob!'
//             }
//         }
// }
async function signEIP712MessageHandler(
  message: EIP712SignReqMessage,
  port: MessagePort | null = null
) {
  const data = message.data;
  if (data.account == null) {
    //没有签名账号,不做处理
    return;
  }
  const wallet = await generateWalletAccount(data.account);
  if (!wallet) {
    return;
  }
  // 执行签名
  const signature = await ethersHelper.signEIP712Message(
    wallet,
    data.primaryType,
    data.domain,
    data.types,
    data.message
  );
  if (!signature) {
    //todo 跳出提示框,提示用户签名失败
    return;
  }
  //签名成功后,发送签名成功消息给APP,并返回签名结果
  const resMessage = {
    version: version,
    type: "signEIP712Success",
    origin: origin,
    data: {
      success: true,
      account: wallet.address,
      chainId: currentChain?.chainId,
      name: currentChain?.name,
      signature: signature,
    },
  };
  if (port) {
    port.postMessage(resMessage);
    // 1秒后关闭port
    setTimeout(() => {
      port.close();
    }, 1000);
  }
  // 关闭当前窗口,并返回原来的窗口
  if (window.opener) {
    // 可以在原窗口中执行一些操作，例如导航
    window.opener.focus(); // 返回并聚焦到原窗口
  }
  window.close();
}

/*******************************基础功能***********************************/

//添加网络
async function _addChain(chainInfo: ChainInfo) {
  if (chainInfo == null) {
    return;
  }
  if (chainInfo.confirms == null || chainInfo.confirms == 0) {
    chainInfo.confirms = 6;
  }
  try {
    await DBHelper.addData(DBHelper.store_chain, chainInfo);
    return true;
  } catch (e) {
    console.error("添加网络失败:", e);
    return false;
  }
}

//修改网络
async function _updateChain(chainInfo: ChainInfo) {
  if (chainInfo == null) {
    return;
  }
  if (chainInfo.confirms == null || chainInfo.confirms == 0) {
    chainInfo.confirms = 6;
  }
  try {
    await DBHelper.updateData(DBHelper.store_chain, chainInfo);
    return true;
  } catch (e) {
    console.error("修改网络失败:", e);
    return false;
  }
}

// 切换网络
async function _switchChain(chainInfo: ChainInfo) {
  try {
    DBHelper.updateData(DBHelper.store_keyinfo, {
      key: "connectedChain",
      value: chainInfo,
    });
    currentChain = chainInfo;
    //连接网络
    const flag = await ethersHelper.connectWithHttps(currentChain.rpcUrl);
    if (!flag) {
      networkStatus = NetworkStauts.disconnect;
      return;
    } else {
      networkStatus = NetworkStauts.connected;
    }
    return true;
  } catch (e) {
    console.error("切换网络失败:", e);
    return false;
  }
}

// 转账
async function _transfer(
  to: string,
  amount: string,
  gasLimit: number,
  gasPrice: string
) {
  if (currentChain == null || networkStatus != NetworkStauts.connected) {
    //todo 跳出提示框,提示用户未连接钱包
    return;
  }
  if (currentAccount == null) {
    //todo 跳出提示框,提示用户没有可用账号
    return;
  }
  const wallet = await generateWalletAccount(currentAccount.account);
  if (!wallet) {
    return;
  }
  // 执行转账
  const txResponse = await ethersHelper.transfer(
    wallet,
    to,
    amount,
    gasLimit,
    gasPrice
  );
  if (!txResponse || !txResponse.hash || !txResponse.provider) {
    //todo 跳出提示框,提示用户转账失败
    return;
  }
  const record = {
    chainId: txResponse.chainId,
    hash: txResponse.hash,
    index: txResponse.index,
    blockNumber: txResponse.blockNumber,
    blockHash: txResponse.blockHash,
    from: txResponse.from,
    to: txResponse.to,
    value: txResponse.value,
    data: txResponse.data,
    gasLimit: txResponse.gasLimit,
    gasPrice: txResponse.gasPrice,
    gasUsed: 0,
    blobGasUsed: 0,
    type: txResponse.type,
    contractAddress: "",
    status: 2, //0:失败,1:成功,2:等待确认
    timestamp: new Date().getTime(),
  };
  DBHelper.addData(DBHelper.store_record, record);
  //等待转账成功
  const receipt = await ethersHelper.waitTransactionConfirm(
    txResponse,
    currentChain.confirms
  );
  if (!receipt) {
    //todo 界面提示用户转账待确认
    return;
  }
  record.gasUsed = Number(receipt.gasUsed);
  record.blobGasUsed = receipt.blobGasUsed ? Number(receipt.blobGasUsed) : 0;
  record.status = 1;
  record.timestamp = new Date().getTime();
  DBHelper.updateData(DBHelper.store_record, record);
  //todo 界面提示转账成功
  return true;
}

//刷新指定交易记录状态,用户点击状态为等待中的交易记录时,调用此方法
async function _refreshRecordStatus(hash: string) {
  //从数据库中获取交易记录
  const record = await DBHelper.getData(DBHelper.store_record, hash);
  if (!record) {
    //todo 跳出提示框,提示用户获取交易记录失败
    return;
  }
  if (currentChain == null || currentChain.chainId != record.chainId) {
    //跳出提示框,开始切换网络
    //数据库查出网络信息
    const chainInfo = await DBHelper.getData(
      DBHelper.store_chain,
      record.chainId
    );
    const flag = _switchChain(chainInfo);
    if (!flag) {
      //todo 跳出提示框,提示用户切换网络失败
      return;
    }
  }
  const receipt = await ethersHelper.checkTransactionStatus(hash);
  record.gasUsed = receipt?.gasUsed;
  record.blobGasUsed = receipt?.blobGasUsed;
  record.status = receipt?.status;
  record.timestamp = new Date().getTime();
  DBHelper.updateData(DBHelper.store_record, record);
}

// 创建钱包账号
async function createWalletAccount() {
  let resAccount = {};
  const accountInfo = await ethersHelper.createWalletAccount();
  if (accountInfo) {
    try {
      //调用webauthn进行账号信息加密,并存储到数据库
      const credential = await registerPasskey();
      // 提取 response 对象
      const userHandle = credential.userHandle;
      // 提取 userHandle 并进行 hash
      const userHandleHash = await crypto.subtle.digest("SHA-256", userHandle);
      //用userHandleHash 生成aes256的密钥,来加密accountInfo.mnemonic
      const cryptoKey = await importAesKeyFromHash(userHandleHash);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const encryptedMnemonic = await crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv,
        },
        cryptoKey,
        new TextEncoder().encode(accountInfo.mnemonic?.phrase)
      );
      //将账号信息(助记词)存储到数据库
      const account = {
        account: accountInfo.address,
        type: "eth",
        credentialId: credential.id,
        mnemonic: encryptedMnemonic,
        iv: iv,
        name: accountInfo.address.substring(0, 6),
        timeStamp: new Date().getTime(),
      };
      resAccount = account;
      DBHelper.updateData(DBHelper.store_account, account).then(() => {
        console.log("账号信息存储成功");
      });
      return resAccount;
    } catch (e) {
      console.error("账号信息加密失败:", e);
      return null;
    }
  } else {
    return null;
  }
}

async function importAesKeyFromHash(userHandleHash: ArrayBuffer) {
  // Convert the userHandleHash (32-byte) into a CryptoKey object
  return await crypto.subtle.importKey(
    "raw", // Raw format of the key
    userHandleHash, // The ArrayBuffer or TypedArray
    { name: "AES-GCM" }, // Algorithm to use for the key
    false, // Not extractable
    ["encrypt", "decrypt"] // Key usages
  );
}

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
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: createCredentialOptions,
    });
    if (!credential) {
      throw new Error("Passkey registration failed");
    }
    return { id: credential?.id, userHandle: userHandle };
  } catch (error) {
    console.error("Passkey registration failed", error);
    throw error;
  }
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
  };

  try {
    const assertion = await navigator.credentials.get({
      publicKey: getCredentialOptions,
    });
    if (!assertion) {
      return null;
    }
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
      response.userHandle ? new TextDecoder("utf-8").decode(response.userHandle) : '没有response.userHandle'
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

const _getCurrentNetwork = () => {
  return currentChain;
};

const _getCurrentAccount = () => {
  return currentAccount;
};

export const initBaseinfo = _initBaseinfo;
export const initNetworks = _initNetworks;
export const connectCmdHandler = _connectCmdHandler;
export const getCurrentNetwork = _getCurrentNetwork;
export const getCurrentAccount = _getCurrentAccount;
export const switchChain = _switchChain;
export const initCommChannel = _initCommChannel;
export const addChain = _addChain;
export const updateChain = _updateChain;
export const transfer = _transfer;
export const refreshRecordStatus = _refreshRecordStatus;
