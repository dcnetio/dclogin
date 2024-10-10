"use client";
// 定义一个变量，用于存储BroadcastChannel对象
const version = 'v_0_0_1';
import utilHelper from '@/helpers/utilHelper';
import ethersHelper from "@/helpers/ethersHelper";
let dcWalletChannel = null;
let DAPPChannel = null;
let walletLoadedFlag = false; //钱包已加载标志
// Dapp信息
let appName = '';
let appIcon = '';
let appVersion = '';

console.log('**************iframejs')
/*******************************初始化需要完成操作***********************************/
const queryString = window.location.search;  
// 使用 URLSearchParams 解析查询字符串  
const urlParams = new URLSearchParams(queryString);  
let  location = urlParams.get('parentOrigin');
// 获取特定参数的值  
const parentOrigin = location;






/*******************************接收父窗口指令消息***********************************/

// 监听父窗口发送的消息
window.addEventListener('message', function(event) {
    //判断消息来源
    if (event.origin !== parentOrigin || event.ports.length == 0) {
        return;
    }
    // 对消息进行json解析
    let message = {};
    if (typeof event.data === 'object') {
        try {
            message = event.data;
            if (message.version !== version) { //版本不一致,不处理
                console.error('Received invalid version:', message.version,"expected version:",version);
                return;
            }
            if (!message.type) { //type为空,不处理
                console.error('Received invalid type: no type');
                return;
            }
        } catch (e) {
            console.error('Received invalid message:', event.data,e);
            return;
        }
    }
    if (message.type == 'channelPort') {//接收父窗口创建与钱包通信的通信通道
        dcWalletChannel = event.ports[0];
        dcWalletChannel.onmessage = onWalletChannelMessage;
        return;
    }
    DAPPChannel = event.ports[0];
    switch (message.type) {
        case 'init': //初始化配置
            initConfig(message.data);
            break;
        case 'connect': //连接钱包命令
            connect();
            break;
        case 'signMessage': //签名消息
            signMessage(message);
            break;
        case 'signEIP712Message': //签名EIP712消息
            signEIP712Message(message);
            break;
        default:
            break;
    }
});



// Dapp初始化配置
function initConfig(config) {
    // 初始化配置
    if (config.appUrl != parentOrigin){
        initConfigResponse(false, 'The appUrl is not equal to the parentOrigin');
        return;
    }
    appName = config.appName;
    appIcon = config.appIcon;
    appVersion = config.appVersion;
    initConfigResponse(true,'success');
}

// 发送初始化结果消息给父窗口
function initConfigResponse(flag, message) {
    let sendMessage = {
        version: version,
        type: 'initConfigResponse',
        data: {
            success: flag,
            message: message
        }
    }
    responseToDAPP(sendMessage);
}


// 父窗口发送的连接命令处理,打开钱包页面前调用
function connect() {
    // 等待钱包加载完成
    walletLoadedFlag = false;
    waitForFlagToTrue(() => walletLoadedFlag)
    .then((flag) => { //钱包已经加载完成
        if (flag) {
            connectWallet();
        } 
    }).catch((e) => {  //超时不处理
      console.log(e);
      walletConnected(false, "", "",err);
      return e;
    });
}

//发送钱包连接成功消息给父窗口
function walletConnected(successFlag,account, chainId,responseData) {
    const sendMessage = {
        version: version,
        type: 'walletConnected',
        data: {
            success: successFlag,
            account: account,
            chainId: chainId,
            responseData: responseData
        }
    }
    responseToDAPP(sendMessage);
   
}

// 父窗口发送的签名消息处理,打开钱包页面前调用
/** message格式为
{
    type: 'string',//string,hex,base64,eip712
    message: 'test message',
}
**/
function signMessage(message) {
    const data = message.data;
    if ( data.message == null) {
        signMessageResponse(false, 'The message is null');
        return;
    }
    // 等待钱包加载完成
    walletLoadedFlag = false;
    waitForFlagToTrue(() => walletLoadedFlag)
    .then((flag) => { //钱包已经加载完成
        if (flag) {
            //发送签名请求消息
            requsetForSignMessage(message);
        } 
    }).catch((e) => {  //超时不处理
        signMessageResponse(false, e);
    });
}

//发送签名成功消息给父窗口
function signMessageResponse(successFlag, message) {
    const sendMessage = {
        version: version,
        type: 'signMessageResponse',
        data: {
            success: successFlag,
            message: message
        }
    }
    responseToDAPP(sendMessage);
}


// 父窗口发送的签名EIP712消息处理,打开钱包页面前调用
/** message格式为
{
    type: 'string',//string,hex,base64,eip712
    message: 'test message',
}
**/
function signEIP712Message(message) {
    const data = message.data;
    //校验数据
    if (data.message == null ) {
        signEIP712MessageResponse(false, 'The  message is null');
        return;
    }
    if (data.domain == null){
        signEIP712MessageResponse(false, 'The domain is null');
        return;
    }
    if (data.primaryType == null){
        signEIP712MessageResponse(false, 'The primaryType is null');
        return;
    }   
    
    // 等待钱包加载完成
    walletLoadedFlag = false;
    waitForFlagToTrue(() => walletLoadedFlag)
    .then((flag) => { //钱包已经加载完成
        if (flag) {
            //发送签名请求消息
            requestSignEIP712Message(message);
        } 
    }).catch((e) => {  //超时不处理
        signEIP712MessageResponse(false, e);
    });
}


//发送签名EIP712成功消息给父窗口
function signEIP712MessageResponse(successFlag, message) {
    const sendMessage = {
        version: version,
        type: 'signEIP712MessageResponse',
        data: {
            success: successFlag,
            message: message
        }
    }
    responseToDAPP(sendMessage);
}


// 发送反馈结果消息给父窗口的DAPP
function responseToDAPP(message) {
    if (DAPPChannel != null) {
        const needCloseChannel = DAPPChannel
        DAPPChannel = null;
        needCloseChannel.postMessage(message);
        // 1秒后关闭通道
        setTimeout(() => {
            needCloseChannel.close();
        }, 1000);
        return;
    }
}



/*********************************与钱包页面通信处理************************************/

 // 利用messageChannel通信,发送消息给钱包页面并等待返回
 const sendMessageToWallet = async (message,timeout) =>  {
    if (!dcWalletChannel) {
      console.error('dcWalletChannel is null');
      return null;
    }
    const messageChannel = new MessageChannel();
    // 等待钱包iframe返回,并关闭channel,超时时间timeout
    return  new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject('timeout');
        }, timeout);
        messageChannel.port1.onmessage = (event) => {
            clearTimeout(timer);
            messageChannel.port1.close();
            resolve(event);
        }
        try {
            dcWalletChannel.postMessage(message,[messageChannel.port2]);
        }catch (e) {
            clearTimeout(timer);
            messageChannel.port1.close();
            reject(e);
        }
    });
  }

// 发送连接命令给钱包页面,并等待返回
function connectWallet() {
    // 像钱包网页发送连接命令
    const message = {
        version: version,
        type: 'connect',
        origin: parentOrigin,
        data: {
            appName: appName,
            appIcon: appIcon,
            appUrl: parentOrigin,
            appversion: appVersion
        }
    }
    //创建新的messageChannel
    sendMessageToWallet(message,60000).then((event) => {
        const message = event.data;
        connectResponse(message.data);
    }).catch((e) => {
        console.log('connectWallet error:',e);
        walletConnected(false, "", "",e);
    });
   // dcWalletChannel.postMessage(message);
}

// 钱包页面响应连接消息处理,data格式为 {success: true, account: '', chainId: '', signature: ''}
async function connectResponse(message) {
    try {
       //签名校验,如果校验失败,则不处理
       const flag = await ethersHelper.verifySignature(parentOrigin,message.signature, message.account);
       if (!flag) {
           console.log('verifySignature failed');
            return;
        }
       walletConnected(message.success, message.account, message.chainId, message);
    } catch (e) {
        console.log('connectResponse error:',e);
        walletConnected(false, "", "",message);
        return;
    }
}

// 发送签名消息给钱包页面,并等待返回
function requsetForSignMessage(orignMessage) {
    const data = orignMessage.data;
    // 向钱包网页发送签名消息
    const message = {
        version: version,
        type: 'signMessage',
        origin: parentOrigin,
        data: {
            appName: appName,
            appIcon: appIcon,
            appUrl: parentOrigin,
            appversion: appVersion,
            account: data.account,
            messagetype: data.type,
            message: data.message
        }
    }
    //创建新的messageChannel
    sendMessageToWallet(message,60000).then((event) => {
        const message = event.data;
        responseForsignMessage(orignMessage,message.data);
    }).catch((e) => {
        signMessageResponse(false, e);
    });
}



// 钱包页面响应签名消息处理
async function responseForsignMessage(orignMessage,message) {
    try {
        if (message.success){
            const waitData = orignMessage.data;
            if (orignMessage.type == 'hex') {
                orignMessage = utilHelper.hexToUint8Array(waitData.message);
                const flag =  await ethersHelper.verifySignature(waitData,message.signature, waitData.account);
                if (!flag) {
                    console.log('verifySignature failed');
                    return;
                }
            }else {
                const flag =  await ethersHelper.verifySignature(waitData.message,message.signature, waitData.account);
                if (!flag) {
                    console.log('verifySignature failed');
                    return;
                }
            }
        }
        //发送签名成功消息给父窗口
        signMessageResponse(message.success, message);
    } catch (e) {
        //发送签名失败消息给父窗口
        signMessageResponse(false, e);
    }
}

// 发送签名EIP712消息给钱包页面
function requestSignEIP712Message(orignMessage) {
    const data = orignMessage.data;
    // 向钱包网页发送签名消息
    const message = {
        version: version,
        type: 'signEIP712Message',
        origin: parentOrigin,
        data: {
            appName: appName,
            appIcon: appIcon,
            appUrl: parentOrigin,
            appversion: appVersion,
            account: data.account,
            messagetype: data.type,
            domain: data.domain,
            primaryType: data.primaryType,
            types: data.types,
            message: data.message,
        }
    }
   //创建新的messageChannel
    sendMessageToWallet(message,60000).then((event) => {
        const message = event.data;
        responseForSignEIP712Message(orignMessage,message.data);
    }).catch((e) => {
        responseForSignEIP712Message(false, e);
    });
}


// 钱包页面响应签名EIP712消息处理
async function responseForSignEIP712Message(orignMessage,message) {
    try {
        const waitData = orignMessage.data;
        if (message.success){
            const flag =  await ethersHelper.verifyEIP712Signature(waitData.primaryType,waitData.domain,
                waitData.types,waitData.message,message.signature, waitData.account);
            if (!flag) {
                console.log('verifyEIP712Signature failed');
                return;
            }
        }
        //发送签名成功消息给父窗口
        signEIP712MessageResponse(message.success, message);
    } catch (e) {
        //发送签名失败消息给父窗口
        signEIP712MessageResponse(false, e);
    }
}




/*********************************接收钱包页面响应信息处理************************************/

// 钱包页面发送的消息处理,只处理加载成功消息,其他消息通过messageChannel处理
function onWalletChannelMessage(event) {
    const message = event.data;
    // 对消息进行json解析
    if (!message) {
        return;
    }
    if (message.version !== version) { //版本不一致,不处理
        console.error('Received invalid version:', message.version,"expected version:",version);
        return;
    }
    if (message.origin !== parentOrigin) { //不是发给当前应用,不处理
        console.error('Received invalid origin:', message.origin,"expected origin:",parentOrigin);
        return;
    }
    switch (message.type) {
        case 'loaded': //钱包页面加载成功
            if (message.origin == parentOrigin) { 
                walletLoadedFlag = true;
            }
            break;
        default:
            break;
    }
}



/*********************************其他处理************************************/

//等待标志位变化
function waitForFlagToTrue(getWalletLoadedFlag) {  
    return new Promise((resolve,reject) => {  
        const interval = setInterval(() => { 
           //发送是否加载完成确认请求
           let flag = getWalletLoadedFlag();
            if (flag) {  
                clearInterval(interval);  
                clearTimeout(timeout);
                resolve(flag);  
            }
        }, 100); // 每100毫秒检查一次  
        const timeout = setTimeout(() => {  
            clearInterval(interval);  
            reject(new Error("Timeout: Flag did not change within 60 seconds"));  
        }, 60000); // 60秒超时  
    });  
}  

