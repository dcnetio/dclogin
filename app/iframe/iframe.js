"use client";
import { useEffect, useState } from 'react'; 
// 定义一个变量，用于存储BroadcastChannel对象
const version = 'v_0_0_1';
const channelName = 'dcwallet_iframe_channel';
import utilHelper from '@/helpers/utilHelper';
import ethersHelper from "@/helpers/ethersHelper";
const dcWalletChannel = new BroadcastChannel("dcwallet_channel");
let broadcastChannel = null;
let walletLoadedFlag = false; //钱包已加载标志
let waitSignMessage =  null; //等待签名消息
let waitSignEip712Message = null; //等待签名EIP712消息
let waitForConnectCode = null; //等待链接的code
//todo 获取父窗口域名,改成动态获取
const  parentOrigin = "http://localhost:3000";
// Dapp信息
let appName = '';
let appIcon = '';
let appVersion = '';

console.log('**************iframejs')
/*******************************初始化需要完成操作***********************************/



//写一个方法创建broadcastChannel
function createDCWalletIframeBroadcastChannel(name) {
    //如果支持BroadcastChannel，直接返回
    if (window.BroadcastChannel) {
        //如果已经创建过，直接返回
        if (broadcastChannel) {
            return broadcastChannel;
        }
        broadcastChannel = new BroadcastChannel(name);
        broadcastChannel.onmessage = onIframeChannelMessage;
        //如果没有创建过，创建一个新的BroadcastChannel对象
        return broadcastChannel;
    }
    //如果不支持，提示错误
    console.error('Your browser does not support BroadcastChannel');
    return null;
}





/*******************************接收父窗口指令消息***********************************/

// 监听父窗口发送的消息
window.addEventListener('message', function(event) {
    //判断消息来源
    if (event.origin !== parentOrigin) {
        return;
    }
    // 对消息进行json解析
    let message = {};
    if (typeof event.data === 'string') {
        try {
            message = JSON.parse(event.data);
            if (message.version !== version) { //版本不一致,不处理
                console.error('Received invalid version:', message.version,"expected version:",version);
                return;
            }
            if (message.code == null) { //code为空,不处理
                console.error('Received invalid code:', message.code);
                return;
            }
        } catch (e) {
            console.error('Received invalid message:', event.data);
            return;
        }
    }
   
    
    /** 判断消息类型,message格式为
     * {
     *      code: 'qmc1XHOCNw',
     *      version: 'v_0_0_1',
     *      type: 'walletDisconnectedReply', //父窗口发送的消息类型 walletDisconnectedReply, walletConnectedReply, chainChangedReply, accountChangedReply
     *      data: { //消息对应数据
     *         ...
     *     }}
     * 
     **/
    let err = null;
    switch (message.type) {
        case 'init': //初始化配置
            console.log('initConfig:', message.data);
            err = initConfig(message.data);
            if (err != null) {
                initConfigResponse(false,message.code, err);
            }else{
                initConfigResponse(true,message.code,'success');
            }
            break;
        case 'connect': //连接命令
            console.log('connect:', message.data);
            err = connect(message.code);
            if (err != null) {
                walletConnected(false,message.code, "", "",err);
            }
            break;
        case 'signMessage': //签名消息
            console.log('signMessage:', message.data);
            err = signMessage(message);
            if (err != null) {
                signMessageResponse(false,message.code, err);
            }
            break;
        case 'signEIP712Message': //签名EIP712消息
            console.log('signEIP712Message:', message);
            err = signEIP712Message(message);
            if (err != null) {
                signEIP712MessageResponse(false,message.code, err);
            }

            break;
        default:
            break;
    }
});

// Dapp初始化配置
function initConfig(config) {
    // 初始化配置
    if (config.appUrl != parentOrigin){
        return 'The appUrl is not equal to the parentOrigin';
    }
    appName = config.appName;
    appIcon = config.appIcon;
    appVersion = config.appVersion;
    createDCWalletIframeBroadcastChannel(channelName);
    if (!broadcastChannel) {
        return 'Your browser does not support BroadcastChannel';
    }else{
        return 
    }
}


// 父窗口发送的连接命令处理,打开钱包页面前调用
function connect(code) {
    // 等待钱包加载完成
    walletLoadedFlag = false;
    waitForFlagToTrue(() => walletLoadedFlag)
    .then((flag) => { //钱包已经加载完成
        if (flag) {
            connectWallet(code);
        } 
    }).catch((e) => {  //超时不处理
      console.log(e);
      return e;
    });
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
    //校验数据
    try {
        if ( data.message == null) {
            return 'The message is null';
        }
    } catch (e) {
        return e;
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
      return e;
    });
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
        return 'The  message is null';
    }
    if (data.domain == null){
        return 'The domain is null';
    }
    if (data.primaryType == null){
        return 'The primaryType is null';
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
        return e;
    });
}











/*******************************发送响应消息给父窗口***********************************/

// 发送初始化结果消息给父窗口
function initConfigResponse(flag,code, message) {
    let sendMessage = {
        code: code,
        version: version,
        type: 'initConfigResponse',
        data: {
            success: flag,
            message: message
        }
    }
    const jsonMessage = JSON.stringify(sendMessage);
    window.parent.postMessage(jsonMessage, parentOrigin);
}

//发送钱包连接成功消息给父窗口
function walletConnected(successFlag,code,account, chainId,responseData) {
    const sendMessage = {
        code: code,
        version: version,
        type: 'walletConnected',
        data: {
            success: successFlag,
            account: account,
            chainId: chainId,
            responseData: responseData
        }
    }
    const jsonMessage = JSON.stringify(sendMessage);
    window.parent.postMessage(jsonMessage, parentOrigin);
}

//发送签名成功消息给父窗口
function signMessageResponse(successFlag,code, message) {
    const sendMessage = {
        code: code,
        version: version,
        type: 'signMessageResponse',
        data: {
            success: successFlag,
            message: message
        }
    }
    const jsonMessage = JSON.stringify(sendMessage);
    window.parent.postMessage(jsonMessage, parentOrigin);
}


//发送签名EIP712成功消息给父窗口
function signEIP712MessageResponse(successFlag,code, message) {
    const sendMessage = {
        code: code,
        version: version,
        type: 'signEIP712MessageResponse',
        data: {
            success: successFlag,
            message: message
        }
    }
    const jsonMessage = JSON.stringify(sendMessage);
    window.parent.postMessage(jsonMessage, parentOrigin);
}

/*********************************与钱包页面通信处理************************************/

// 发送连接命令给钱包页面
function connectWallet(code) {
    // 像钱包网页发送连接命令
    const message = {
        code: code,
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
    waitForConnectCode = code;
    const jsonMessage = JSON.stringify(message);
    dcWalletChannel.postMessage(jsonMessage);
}

// 发送签名消息给钱包页面
function requsetForSignMessage(orignMessage) {
    const data = orignMessage.data;
    // 向钱包网页发送签名消息
    const message = {
        code: orignMessage.code,
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
    waitSignMessage = orignMessage;
    const jsonMessage = JSON.stringify(message);
    dcWalletChannel.postMessage(jsonMessage);
}

// 发送签名EIP712消息给钱包页面
function requestSignEIP712Message(orignMessage) {
    const data = orignMessage.data;
    // 向钱包网页发送签名消息
    const message = {
        code: orignMessage.code,
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
    waitSignEip712Message = orignMessage;
    const jsonMessage = JSON.stringify(message);
    dcWalletChannel.postMessage(jsonMessage);
}





/*********************************接收钱包页面响应信息处理************************************/


//创建一个BroadcastChannel的监听消息处理函数
function onIframeChannelMessage(event) {
    let message = null;
    // 对消息进行json解析
    if (typeof event.data === 'string') {
        try {
            message = JSON.parse(event.data);
        } catch (e) {
            console.error('Received invalid message:', event.data);
            return;
        }
    }
    if (message.version !== version) { //版本不一致,不处理
        console.error('Received invalid version:', message.version,"expected version:",version);
        return;
    }
    if (message.origin !== parentOrigin) { //不是发给当前应用,不处理
        console.error('Received invalid origin:', message.origin,"expected origin:",parentOrigin);
        return;
    }
    /** 判断消息类型,message格式为
     * {
     *      type: 'getUserInfo', 
     *      data: {
                type: 'getUserInfo', //消息类型,
                mēssage: '获取用户信息'
            }
        }
    **/
    switch (message.type) {
        case 'loaded': //钱包页面加载成功
            if (message.origin == parentOrigin) { 
                walletLoadedFlag = true;
            }
            break;
        //如果是获取用户信息的消息
        case 'connected': //连接成功
            if (message.data  != null && message.code == waitForConnectCode) {
                connectResponse(message.code,message.data);
            }
            break;
        case 'signSuccess': //签名成功
            if (message.data != null && message.code == waitSignMessage.code) {
                responseForsignMessage(message.code,message.data);
            }
            break;
        case 'signEIP712Success': //签名EIP712成功
            if (message.data != null && message.code == waitSignEip712Message.code) {
                responseForSignEIP712Message(message.code,message.data);
            }
            break
        default:
            break;
    }
}


// 接受钱包页面响应连接消息,data格式为 {success: true, account: '', chainId: '', signature: ''}
async function connectResponse(code,message) {
    try {
       //签名校验,如果校验失败,则不处理
       const flag = await ethersHelper.verifySignature(parentOrigin,message.signature, message.account);
       if (!flag) {
           console.log('verifySignature failed');
            return;
        }
       walletConnected(message.success,code, message.account, message.chainId, message);
    } catch (e) {
        walletConnected(false,code, "", "",message);
        return;
    }
}

// 接受钱包页面响应签名消息
async function responseForsignMessage(code,message) {
    try {
        if (message.success){
            // 进行签名校验,如果校验失败,则提示父窗口签名失败
            if (waitSignMessage == null) {
                console.log('waitSignMessage is null');
                return;
            }
            const waitData = waitSignMessage.data;
            if (waitSignMessage.type == 'hex') {
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
        signMessageResponse(message.success,code, message);
    } catch (e) {
        //发送签名失败消息给父窗口
        signMessageResponse(false,code, e);
    }
}

// 接受钱包页面响应签名EIP712消息
async function responseForSignEIP712Message(code,message) {
    try {
        // 进行签名校验,如果校验失败
        if (waitSignEip712Message == null) {
            console.log('waitSignEip712Message is null');
            return;
        }
        const waitData = waitSignEip712Message.data;
        if (message.success){
            const flag =  await ethersHelper.verifyEIP712Signature(waitData.primaryType,waitData.domain,
                waitData.types,waitData.message,message.signature, waitData.account);
            if (!flag) {
                console.log('verifyEIP712Signature failed');
                return;
            }
        }
        //发送签名成功消息给父窗口
        signEIP712MessageResponse(message.success,code, message);
    } catch (e) {
        //发送签名失败消息给父窗口
        signEIP712MessageResponse(false,code, e);
    }
}


/*********************************其他处理************************************/

//等待标志位变化
function waitForFlagToTrue(getWalletLoadedFlag) {  
    return new Promise((resolve,reject) => {  
        const interval = setInterval(() => {  
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

