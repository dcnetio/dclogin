"use client";
import utilHelper from "@/helpers/utilHelper";
import ethersHelper from "@/helpers/ethersHelper";
import { defaultNetworks } from "@/config/constant";
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
import * as buffer from "buffer/";
const { Buffer } = buffer;

// 定义一个变量，用于存储BroadcastChannel对象
let currentChain: ChainInfo | null = null; //当前网络
let currentAccount: AccountInfo | null = null; //当前账号

// 数据库
import DBHelper from "@/helpers/DBHelper";
import {
  showAddDAPPNote,
  showEncodePassword,
  showSetEncodePassword,
  showSignatureDAPPNote,
} from "@/components/note/noteHelper";
import { Toast } from "antd-mobile";
import i18n from "@/locales/i18n";
import { ChooseAccount } from "@/components/common/accountHelper";
import { Ed25519PrivKey, KeyManager, NFTBindStatus, User, version } from "web-dc-api";
import { APPInfo } from "@/types/pageType";
import NavigationService from "@/lib/navigation";
import { applyFreeSpace } from "./tools/subSpace";


// 获取查询字符串
let queryString = "";
console.log("window1111");
if (typeof window !== "undefined") {
  queryString = window.location.search;
}
console.log("window2222");
const urlParams = new URLSearchParams(queryString);
const location = urlParams.get("origin");
const openerOrigin = location;
let iframeChannel = null;

const NetworkStauts = Object.freeze({
  connecting: 0,
  connected: 1,
  disconnect: 2,
});
let networkStatus: number = NetworkStauts.disconnect; //网络状态
let messageData: ConnectReqMessage = {origin: ""};
let portData: MessagePort | null = null;

/*******************************初始化需要完成操作***********************************/

// 监听DAPP窗口发送的消息;
if (typeof window !== "undefined") {
  if (window.location.href.indexOf('/test') == -1 && window.location.href.indexOf('/iframe') == -1) {
    console.log("===============监听DAPP窗口发送的消息 11111", window.location.href);

    window.addEventListener("message", function (event) {
      //判断消息来源
    console.log("===============监听DAPP窗口发送的消息 event", event);
    if (
      !(
        event.origin === openerOrigin ||
        (event.origin === "null" && openerOrigin === "file://")
      ) ||
      event.ports.length == 0
    ) {
        return;
      }
      onDAPPMessage(event);
    });
  }
}

//初始化网络列表,并连接最近切换的网络
async function _initNetworks () {
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
          // 设置初始化账户信息+网络信息{key:"connectedChain",value"aaaaa"}
          await DBHelper.addData(DBHelper.store_keyinfo, {
            key: "connectedChain",
            value: currentChain,
          });
          networkStatus = NetworkStauts.connected;
        }
      }
    }
  }
  // if (currentAccount == null) {
  //   //从数据库中获取第一个账号信息
  //   const accounts = await DBHelper.getAllData(DBHelper.store_account);
  //   if (accounts.length > 0) {
  //     currentAccount = accounts[0];
  //     console.log("111111111111111 _initNetworks currentAccount", currentAccount);
  //   }
  // }
}

// 初始化基本信息(初始化网络为最近切换的网络,账号为最近切换的账号)
async function _initBaseinfo () {
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
        "choosedAccount"
      );
      if (accountinfo && accountinfo.value) {
        currentAccount = accountinfo.value;
        console.log("111111111111111 _initBaseinfo currentAccount", currentAccount);
      }
    }
  } catch (e) {
    console.error("获取网络信息失败:", e);
  }
}

//启动定时器,定时检查网络状态,如果网络状态为断开,则重新连接
let checkCount = 0;
if (typeof window !== "undefined") {
  if (window.location.href.indexOf('/test') == -1 && window.location.href.indexOf('/iframe') == -1) {
    console.log("===============启动定时器 11111", window.location.href);

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
  }
}
// 通知DAPP,钱包加载完成
function _initCommChannel () {
  //通知DAPP,钱包加载完成
  const message = {
    type: "walletLoaded",
    data: {
      origin: window.location.origin,
    },
  };
  if (window.opener) {
    let origin = openerOrigin;
    if(openerOrigin?.indexOf('file://') !== -1) {
      origin = '*'
    }
    window.opener.postMessage(message, origin);
  }
}

// 来自DAPP的消息处理
function onDAPPMessage (event: MessageEvent) {
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
    case "channelPort2": 
      iframeChannel = event.ports[0];
      iframeChannel.onmessage = onDAPPMessage;
      const loadedMessage = {
        type: "loaded",
        version: version,
        origin: openerOrigin,
      };
      iframeChannel.postMessage(loadedMessage); //利用messageChannel通知页面加载完成,当浏览器不支持window.opener会走这个流程
      break;
    case "connect": //连接钱包请求
      console.log("connect=====", message);
      console.log("event=====", event);
      if (isConnectReqMessage(message)) {
        const connectingApp = message.data;
        if (openerOrigin && connectingApp) {
          // 保存dappinfo
          if(globalThis.dc ){
            const dappInfo = {
              appId: connectingApp?.appId,
              appName: connectingApp?.appName,
              appIcon: connectingApp?.appIcon,
              appUrl: connectingApp?.appUrl,
              appVersion: connectingApp?.appVersion,
            };
            globalThis.dc.setAppInfo(dappInfo);
          }
          //显示提示页面
          showAddDAPPNote(connectingApp, () => {
            _connectCmdHandler(message, true, event.ports[0]);
          });
          return;
        } else {
          _connectCmdHandler(message, true, event.ports[0]);
        }
      }
      break;
    case "signMessage": //签名请求
      if (isSignReqMessage(message)) {
        const data = message.data;
        if (openerOrigin && data) {
          //显示提示页面
          showSignatureDAPPNote(data.appUrl, data.message, () => {
            signMessageHandler(message, event.ports[0]);
          });
          return;
        } else {
          signMessageHandler(message, event.ports[0]);
        }
      }
      break;
    case "signEIP712Message": //签名EIP712请求
      if (isEIP712SignReqMessage(message)) {
        const data = message.data;
        if (openerOrigin && data) {
          //显示提示页面
          showSignatureDAPPNote(data.appUrl, data.message, () => {
            signEIP712MessageHandler(message, event.ports[0]);
          });
          return;
        } else {
          signEIP712MessageHandler(message, event.ports[0]);
        }
      }
      break;
    default:
      break;
  }
}

// 获取已有的账号
async function chooseStoredAccount (
  connectingApp:
    | APPInfo
    | undefined
) {
  if (currentAccount) {
    console.log("currentAccount 已经存在", currentAccount);
    return currentAccount;
  }
  //判断用户是否已经创建过钱包账号,如果没有,则跳出状态等待框,提示用户账号创建中
  const accounts = await DBHelper.getAllData(DBHelper.store_account);
  if (!accounts || accounts.length == 0) {
    return;
  }
  console.log("11111111111111111111accounts 数据", accounts);
  //todo 跳出选择账号框,让用户选择账号
  if (connectingApp) {
    // DAPP打开，需要选择账号
    console.log(
      "11111111111111111111connectingApp 选择一个账号",
      connectingApp
    );
    const accountinfo = (await ChooseAccount()) as AccountInfo;
    console.log(
      "11111111111111111111connectingApp 选择一个账号 accountinfo",
      accountinfo
    )
    currentAccount = accountinfo; // 赋值
    console.log(
      "11111111111111111111connectingApp 选择一个账号 currentAccount",
      currentAccount
    );
    return currentAccount;
  } else {
    // 钱包页面自己打开
    console.log("11111111111111111111钱包页面自己打开， 默认选择choosedAccount");
    const accountinfo = await DBHelper.getData(
      DBHelper.store_keyinfo,
      "choosedAccount"
    );
    if (accountinfo && accountinfo.value) {
      currentAccount = accountinfo.value;
      console.log(
        "11111111111111111111钱包页面自己打开， 默认选择choosedAccount currentAccount",
        currentAccount
      );
      return currentAccount;
    } else {
      await DBHelper.addData(DBHelper.store_keyinfo, {
        key: "choosedAccount",
        value: accounts[0],
      });
      currentAccount = accounts[0]; // 赋值
      console.log(
        "11111111111111111111accounts就一个账号， 默认选择这个账号",
        currentAccount
      );
      return currentAccount;
    }
  }
}

const bindNFTAccount = async (
  account: string = '',
  password: string = '',
  safecode: string = '',
  mnemonic: string = '',
  pubKeyStr: string = '',
): Promise<[boolean, Error | null]> => {
  const bindRes = await globalThis.dc.auth.bindNFTAccount(account, password, safecode, mnemonic);
  if(bindRes[0] !== NFTBindStatus.Success) {
    return bindRes;
  }
  // 循环checkNFT绑定状态
  const checkFlag = await _checkBind(account, pubKeyStr);
  if(!checkFlag) {
    return [false, new Error(i18n.t("account.bind_nft_account_timeout"))];
  }
  return [true, null];
}

const _checkBind = (account: string, pubKeyStr: string) => {
  const maxNum = 20;
  let interval: any = null, // 定时器
    intervalNum = 0; // 定时判断是否绑定成功
  return new Promise(resolve => {
    // 初始化定时器
    interval ? clearInterval(interval) : '';
    intervalNum = 0;
    interval = setInterval(async () => {
      intervalNum++;
      // 判断是否绑定成功
      let bindFlag = await globalThis.dc.auth.isNftAccountBindSuccess(
        account,
        pubKeyStr,
      );
      // console.log(
      //   '---------ifNftAccountBindSuccessData',
      //   ifNftAccountBindSuccessData,
      // );
      if (bindFlag) {
        // 绑定成功停止定时任务
        clearInterval(interval);
        intervalNum = 0;
        resolve(true);
      } else if (intervalNum > maxNum) {
        // 超时停止定时任务
        clearInterval(interval);
        intervalNum = 0;
        resolve(false);
      }
    }, 1000);
  });
};

// 创建账号(注册)
async function _createAccountWithRegister (
  account: string, 
  password : string, 
  safecode : string,
) {
  // 判断account是否已经存在
  const nftBinded = await globalThis.dc.auth.isNftAccountBinded(account);
  if(nftBinded) {
    //todo 跳出提示框,提示用户该账号已经绑定了NFT
    Toast.show({
      content: i18n.t("account.nft_account_binded"),
      position: "bottom",
    });
    return;
  }
  let res = await ethersHelper.createWalletAccount();
  if(!res || !res.mnemonic) {
    return;
  }
  let mnemonicObj =  res.mnemonic; // 对象
  let mnemonic = mnemonicObj.phrase ; // 助记词
  let address =  res.address;
  const pubKey  = localStorage.getItem("publicKey");
  if(pubKey) {
    // 读取webauthhash
    const chooseAccount = await chooseStoredAccount(undefined);
    if (chooseAccount) {
      const resMnemonic = await unlockWallet (chooseAccount);
      if (resMnemonic) {
        mnemonic = resMnemonic;
        address = chooseAccount.account;
      }
    }
    localStorage.removeItem("publicKey");
  }
  const keymanager = new KeyManager();
  const privKey: Ed25519PrivKey = await keymanager.getEd25519KeyFromMnemonic(
    mnemonic,
    ''
  );
  // 保存公钥
  localStorage.setItem(
    "publicKey",
    privKey.publicKey.toString(),
  );
  // 赠送套餐
  const giveFlag = await applyFreeSpace(privKey.publicKey);
  if(giveFlag[1] && giveFlag[1].message && giveFlag[1].message.indexOf('User already has space') === -1) {
    //待测试 跳出提示框,提示用户赠送套餐失败
    Toast.show({
      content: i18n.t("account.give_space_failed"), // todo
      position: "bottom",
    });
    return;
  }
  // bind nft
  const bindRes = await bindNFTAccount(
    account,
    password,
    safecode,
    mnemonic,
    '0x' + privKey.publicKey.toString(),
  );
  if(bindRes[0] !== true) {
    //待测试 跳出提示框,提示用户赠送套餐失败
    Toast.show({
      content: i18n.t("account.bind_nft_account_failed"), // todo
      position: "bottom",
    });
    if(bindRes[1] && bindRes[1].message && bindRes[1].message.indexOf('user has binded an account') !== -1) {
      localStorage.removeItem("publicKey");
    }
    return;
  }
  Toast.show({
    content: i18n.t("register.success"), // todo
    position: "bottom",
  });
  return {
    success: true,
  }
}
// 创建账号(登录)
async function _createAccountWithLogin (
  account: string, 
  password : string, 
  safecode : string,
  origin?: string,
) {
  const res = await globalThis.dc.auth.accountLogin(account, password, safecode);
  if(!res || !res.mnemonic) {
    return;
  }
  // 登录成功，得到私钥
  const privKey = res.privKey;
  const mnemonic = res.mnemonic;
  // 助记词信息， 私钥转助记词
  const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
  const address = wallet.address;
  const accountInfo = await createAccount(mnemonic, address);
  if(!accountInfo){
    return;
  }
  if(origin || messageData.origin) {
    const message: ConnectReqMessage = {
      origin: origin || '',
    };
    const res = await resPonseWallet(mnemonic, messageData.origin ? messageData :message, true, portData);
    return res;
  }else {
    return await resPonseWallet(mnemonic);
  }
}
// 创建账号
async function createAccount (
  mnemonic: string | null = null,
  address: string = '',
  connectingApp:
    | APPInfo
    | null = null
) {
  let accounts = [];
  try {
      //待测试 跳出状态等待框,提示用户账号创建中，需要手动关闭
      Toast.show({
        content: i18n.t("account.creating"),
        position: "bottom",
        duration: 0,
      });
      // 保存用户信息
      const account = await createWalletAccount(mnemonic, address);
      console.log("11111111111111111111account 创建", account);
      //待测试 关闭状态等待框
      Toast.clear();
      if (!account) {
        return;
      }
      //待测试 跳出账号创建成功提示框
      Toast.show({
        content: i18n.t("account.create_success"),
        position: "bottom",
      });
      accounts.push(account);
  } catch (e) {
    console.error("获取账号信息失败:", e);
    //待测试 跳出提示框,提示用户创建账号失败
    Toast.show({
      content: i18n.t("account.create_failed"),
      position: "bottom",
    });
    return;
  }
  //todo 跳出选择账号框,让用户选择账号
  if (connectingApp) {
    // DAPP打开，需要选择账号
    const accountinfo = (await ChooseAccount()) as AccountInfo;
    currentAccount = accountinfo; // 赋值
  } else {
    // 钱包页面自己打开
    const accountinfo = await DBHelper.getData(
      DBHelper.store_keyinfo,
      "choosedAccount"
    );
    if (accountinfo && accountinfo.value) {
      currentAccount = accountinfo.value;
    } else {
      await DBHelper.addData(DBHelper.store_keyinfo, {
        key: "choosedAccount",
        value: accounts[0],
      });
      currentAccount = accounts[0]; // 赋值
    }
  }
  return currentAccount
}


// 收到连接钱包请求处理,message格式为{version:'v0_0_1',type: 'connect',data: {appName:'test',appIcon:'',appUrl: 'http://localhost:8080',appVersion: '1.0.0'}}
async function _connectCmdHandler (
  message: ConnectReqMessage,
  bool: boolean,
  port: MessagePort | null = null
) {
  const connectingApp = message.data;
  // 获取当前网络
  const chain = await getCurrentChain();
  if(!chain){
    //待测试 跳出提示框,提示用户获取网络信息失败
    Toast.show({
      content: i18n.t("network.get_failed"),
      position: "bottom",
    });
    return;
  }
  // 异步获取当前网络状态,更新钱包网络状态
  const flag = await ethersHelper.checkNetworkStatus();
  if (flag) {
    networkStatus = NetworkStauts.connected;
  } else {
    networkStatus = NetworkStauts.disconnect;
  }
  if (networkStatus == NetworkStauts.disconnect) {
    // 网络问题，则提示不继续
    Toast.show({
      content: i18n.t("network.disconnect"),
      position: "bottom",
    });
    return;
  }

  let chooseAccount = await chooseStoredAccount(connectingApp);
  if (!chooseAccount) {
    // todo没有用户的时候，需要跳转到登录页面
    messageData = message;
    portData = port;
    NavigationService.navigate("login", {
      origin: message.origin,
    });
    return;
  }
  const mnemonic = await unlockWallet (chooseAccount);
  if(!mnemonic) {
    return;
  }
  return await resPonseWallet(mnemonic, message, bool, port);
}

const getCurrentChain = async () => {
  // 取出网络列表
  let chains = [];
  try {
    chains = await DBHelper.getAllData(DBHelper.store_chain);
  } catch (e) {
    console.error("获取网络信息失败:", e);
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
  try {
    // 获取网络信息
    const jsonRpcProvider = ethersHelper.getProvider();
    if (jsonRpcProvider != null) {
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
  } catch (error) {
    
  }
  return currentChain;
}

// 解锁钱包并返回数据信息
async function unlockWallet (
  chooseAccount: AccountInfo, ) {
  // 获取当前网络
  const chain = await getCurrentChain();
  if(!chain || !currentChain){
    //待测试 跳出提示框,提示用户获取网络信息失败
    Toast.show({
      content: i18n.t("network.get_failed"),
      position: "bottom",
    });
    return;
  }
  let userHandleHash: ArrayBuffer | null = null;
  if(chooseAccount.credentialId){
    Toast.show({
      content: i18n.t("account.auth_doing"),
      position: "bottom",
      duration: 0,
    });
    //用户确认后,调出webauthn进行校验,并提取出userHandleHash
    userHandleHash = await authenticateWithPasskey(
      chooseAccount.credentialId
    );
    console.log("userHandleHash success", userHandleHash);
    //待测试 关闭状态等待框
    Toast.clear();
  }
  if (!userHandleHash) {
    //todo 跳出密码设置框,提示用户输入密码加密
    userHandleHash = await getEncodePwd({
      iv: chooseAccount.iv,
      encodeMnimonic: chooseAccount.mnemonic,
    });
  }
  if(!userHandleHash) {
    //待测试 跳出提示框,提示用户解锁钱包失败
    Toast.show({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
    return;
  }
  //解密出助记词
  const mnemonic = await utilHelper.decryptMnemonic(chooseAccount.iv, chooseAccount.mnemonic, userHandleHash);
  if(!mnemonic){
    Toast.show({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
    return;
  }
  return mnemonic;
}

async function resPonseWallet(
  mnemonic:  string,
  message: ConnectReqMessage = {} as ConnectReqMessage,
  bool: boolean = false,
  port: MessagePort | null = null
) {
  if(!currentChain){
    //待测试 跳出提示框,提示用户获取网络信息失败
    Toast.show({
      content: i18n.t("network.get_info_failed"),
      position: "bottom",
    });
    return;
  }
  let connectingApp = message.data;
  if(!connectingApp) {
    connectingApp = globalThis.dc.appInfo;
  }
  // 通过助记词导入钱包,生成带私钥钱包账号
  const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
  if (!wallet) {
    //待测试 跳出提示框,提示用户解锁钱包失败
    Toast.show({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
    return;
  }
  if(!globalThis.dc) {
    //待测试 跳出提示框,提示用户签名失败
    Toast.show({
      content: i18n.t("sign.sign_failed"),
      position: "bottom",
    });
    return;
  }
  // 获取用户信息，判断是否有空间
  let publicKey = globalThis.dc.publicKey;
  if(publicKey == null) {
    // DCAPP进入
    const keymanager = new KeyManager();
    const privKey: Ed25519PrivKey = await keymanager.getEd25519KeyFromMnemonic(
      mnemonic,
      connectingApp?.appId || ''
    );
    publicKey = privKey.publicKey;
  }
  let userInfo: User | null = null;
  try {
    userInfo = await globalThis.dc.auth.getUserInfoWithAccount("0x" + publicKey.toString());
  } catch (error) {
  }
  // 执行签名
  const signature = await ethersHelper.signMessage(wallet, message.origin);
  if (!signature) {
    //待测试 跳出提示框,提示用户签名失败
    Toast.show({
      content: i18n.t("sign.sign_failed"),
      position: "bottom",
    });
    return;
  }
  if (bool) {
    // DCAPP进入
    const keymanager = new KeyManager();
    const privKey: Ed25519PrivKey = await keymanager.getEd25519KeyFromMnemonic(
      mnemonic,
      connectingApp?.appId || ''
    );
    //签名成功后,发送链接成功消息给APP
    const resMessage = {
      version: version,
      type: "connected",
      origin: message.origin,
      data: {
        success: true,
        account: wallet.address,
        chainId: currentChain.chainId,
        chainName: currentChain.name,
        signature: signature,
        privateKey: privKey,
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
      appId: connectingApp?.appId,
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

// 获取用户加密密码
async function getEncodePwd(info: {iv: Uint8Array, encodeMnimonic: ArrayBuffer}): Promise<ArrayBuffer> { 
  return new Promise((resolve, reject) => {
    // todo 显示用户加密密码页面
    showEncodePassword(info, (password) => {
      // 处理结果
      resolve(password);
    });
  })
}

// 设置用户加密密码
async function setEncodePwd(): Promise<Uint8Array> { 
  return new Promise((resolve, reject) => {
    // todo 显示用户加密密码页面
    showSetEncodePassword((userHandle: Uint8Array) => {
      // 处理结果
      resolve(userHandle);
    });
  })
}
// 根据账号,生成签名的钱包账号对象
async function generateWalletAccount (seedAccount: string) {
  let account = null;
  // 数据库里获取账号信息
  try {
    account = await DBHelper.getData(DBHelper.store_account, seedAccount);
    if (account == null) {
      //待测试 跳出提示框,提示钱包里的用户账号不存在
      Toast.show({
        content: i18n.t("account.wallet_no_account"),
        position: "bottom",
      });
      return null;
    }
  } catch (e) {
    console.error("获取账号信息失败:", e);
    //待测试 跳出提示框,提示用户获取账号信息失败
    Toast.show({
      content: i18n.t("account.get_info_failed"),
      position: "bottom",
    });
    return null;
  }

  let userHandleHash: ArrayBuffer | null = null;
  if(account.credentialId){
    Toast.show({
      content: i18n.t("account.auth_doing"),
      position: "bottom",
      duration: 0,
    });
    //用户确认后,调出webauthn进行校验,并提取出userHandleHash
    userHandleHash = await authenticateWithPasskey(
      account.credentialId
    );
    console.log("userHandleHash success", userHandleHash);
    //待测试 关闭状态等待框
    Toast.clear();
  }
  if (!userHandleHash) {
    //todo 跳出密码设置框,提示用户输入密码加密
    userHandleHash = await getEncodePwd( {
      iv: account.iv,
      encodeMnimonic: account.mnemonic,
    });
  }
  if(!userHandleHash) {
    //待测试 跳出提示框,提示用户解锁钱包失败
    Toast.show({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
    return;
  }
  //解密出助记词
  const mnemonic = await utilHelper.decryptMnemonic (account.iv, account.mnemonic, userHandleHash);
  if (!mnemonic) {
    //待测试 跳出提示框,提示用户导入钱包失败
    Toast.show({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
  }
  // 通过助记词导入钱包,生成带私钥钱包账号
  const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
  if (!wallet) {
    //待测试 跳出提示框,提示用户导入钱包失败
    Toast.show({
      content: i18n.t("account.unlock_wallet_failed"),
      position: "bottom",
    });
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
async function signMessageHandler (
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
      //待测试 跳出提示框,提示用户签名失败
      Toast.show({
        content: i18n.t("account.auth_failed"),
        position: "bottom",
      });
      return;
    }
  } else {
    // 执行签名
    signature = await ethersHelper.signMessage(wallet, data.message);
    if (!signature) {
      //待测试 跳出提示框,提示用户签名失败
      Toast.show({
        content: i18n.t("sign.sign_failed"),
        position: "bottom",
      });
      return;
    }
  }

  //签名成功后,发送签名成功消息给APP,并返回签名结果
  const resMessage = {
    version: version,
    type: "signSuccess",
    origin: message.origin,
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
async function signEIP712MessageHandler (
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
    //待测试 跳出提示框,提示用户签名失败
    Toast.show({
      content: i18n.t("sign.sign_failed"),
      position: "bottom",
    });
    return;
  }
  //签名成功后,发送签名成功消息给APP,并返回签名结果
  const resMessage = {
    version: version,
    type: "signEIP712Success",
    origin: message.origin,
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
async function _addChain (chainInfo: ChainInfo) {
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
async function _updateChain (chainInfo: ChainInfo) {
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
async function _switchChain (chainInfo: ChainInfo) {
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
async function _transfer (
  to: string,
  amount: string,
  gasLimit: number,
  gasPrice: string
) {
  if (currentChain == null || networkStatus != NetworkStauts.connected) {
    //待测试 跳出提示框,提示用户未连接钱包
    Toast.show({
      content: i18n.t("account.wallet_not_connect"),
      position: "bottom",
    });
    return;
  }
  if (currentAccount == null) {
    //待测试 跳出提示框,提示用户没有可用账号
    Toast.show({
      content: i18n.t("account.no_account"),
      position: "bottom",
    });
    return;
  }
  const wallet = await generateWalletAccount(currentAccount.account);
  if (!wallet) {
    return;
  }
  try {
    // 执行转账
    const txResponse = await ethersHelper.transfer(
      wallet,
      to,
      amount,
      gasLimit,
      gasPrice
    );
    if (!txResponse || !txResponse.hash || !txResponse.provider) {
      //待测试 跳出提示框,提示用户转账失败
      Toast.show({
        content: i18n.t("transfer.transfer_failed"),
        position: "bottom",
      });
      return;
    }
    const record = {
      chainId: txResponse.chainId ? Number(txResponse.chainId) : "",
      hash: txResponse.hash || "",
      index: txResponse.index || "",
      blockNumber: txResponse.blockNumber || "",
      blockHash: txResponse.blockHash || "",
      from: txResponse.from || "",
      to: txResponse.to || "",
      value: txResponse.value ? Number(txResponse.value) : "",
      data: txResponse.data || "",
      gasLimit: txResponse.gasLimit ? Number(txResponse.gasLimit) : "",
      gasPrice: txResponse.gasPrice || "",
      gasUsed: 0,
      blobGasUsed: 0,
      type: txResponse.type,
      contractAddress: "",
      status: 2, //0:失败,1:成功,2:等待确认
      timestamp: new Date().getTime(),
    };
    await DBHelper.addData(DBHelper.store_record, record);
    // 等待转账成功
    const receipt = await ethersHelper.waitTransactionConfirm(
      txResponse,
      currentChain.confirms
    );
    if (!receipt) {
      //待测试 界面提示用户转账待确认
      Toast.show({
        content: i18n.t("transfer.transfer_pending"),
        position: "bottom",
      });
      return;
    }
    record.blockNumber = receipt.blockNumber;
    record.blockHash = receipt.blockHash;
    record.gasPrice = receipt.gasPrice;
    record.gasUsed = receipt.gasUsed ? Number(receipt.gasUsed) : 0;
    record.blobGasUsed = receipt.blobGasUsed ? Number(receipt.blobGasUsed) : 0;
    record.status = 1;
    record.timestamp = new Date().getTime();
    DBHelper.updateData(DBHelper.store_record, record);
    //待测试 界面提示转账成功
    Toast.show({
      content: i18n.t("transfer.transfer_success"),
      position: "bottom",
    });
    return true;
  } catch (error) {
    console.log("transfer error", error);
    return false;
  }
}

//刷新指定交易记录状态,用户点击状态为等待中的交易记录时,调用此方法
async function _refreshRecordStatus (hash: string) {
  //从数据库中获取交易记录
  const record = await DBHelper.getData(DBHelper.store_record, hash);
  if (!record) {
    //待测试 跳出提示框,提示用户获取交易记录失败
    Toast.show({
      content: i18n.t("transfer.get_transferlist_failed"),
      position: "bottom",
    });
    return;
  }
  if (currentChain == null || currentChain.chainId != record.chainId) {
    //todo 跳出提示框,开始切换网络
    //数据库查出网络信息
    const chainInfo = await DBHelper.getData(
      DBHelper.store_chain,
      record.chainId
    );
    const flag = _switchChain(chainInfo);
    if (!flag) {
      //待测试 跳出提示框,提示用户切换网络失败
      Toast.show({
        content: i18n.t("network.switch_failed"),
        position: "bottom",
      });
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
async function createWalletAccount (mnemonic: string | null = null, address: string = '') {
  let resAccount = {};
  if (mnemonic) {
    try {
      let userHandle: Uint8Array;
      //调用webauthn进行账号信息加密,并存储到数据库
      const credential = await registerPasskey();
      // 提取 response 对象
      userHandle = credential.userHandle;
      // todo 判断userHandle是否存在
      if (!userHandle) {
        //todo 跳出密码设置框,提示用户输入密码加密
        userHandle = await setEncodePwd();
        if(!userHandle) {
          return ;
        }
      }
      // 提取 userHandle 并进行 hash
      const userHandleHash = await crypto.subtle.digest("SHA-256", userHandle);
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      //用userHandleHash 生成aes256的密钥,来加密accountInfo.mnemonic
      const encryptedMnemonic = await utilHelper.encryptMnemonic(iv, mnemonic, userHandleHash);
      //将账号信息(助记词)存储到数据库
      const account = {
        account: address,
        type: "eth", // todo 账号类型
        credentialId: credential.id,
        mnemonic: encryptedMnemonic,
        iv: iv,
        name: address.substring(0, 6),
        timeStamp: new Date().getTime(),
      };
      resAccount = account;
      const res = await DBHelper.updateData(DBHelper.store_account, account);
      console.log("账号信息存储成功", res);
      return resAccount;
    } catch (e) {
      console.error("账号信息加密失败:", e);
      return ;
    }
  } else {
    return ;
  }
}

// 注册新的 Passkey
async function registerPasskey () {
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
    extensions: {
      hmacCreateSecret: true,
    },
  };

  try {
    const credential = await navigator.credentials.create({
      publicKey: createCredentialOptions,
    });
    if (!credential) {
      throw new Error("Passkey registration failed");
    }
    const extensionResults = (
      credential as PublicKeyCredential
    ).getClientExtensionResults();
    console.log("HMAC Secret Used:", extensionResults.hmacCreateSecret);
    return { id: credential?.id, userHandle: userHandle };
  } catch (error) {
    console.error("Passkey registration failed", error);
    // throw error;
    return { id: '', userHandle: '' };
  }
}

// 使用 Passkey 进行身份验证,并提取出userHandleHash
async function authenticateWithPasskey (credentialId: string) {
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
export const createAccountWithLogin = _createAccountWithLogin;
export const createAccountWithRegister = _createAccountWithRegister;