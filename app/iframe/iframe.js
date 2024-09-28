
// 定义一个变量，用于存储BroadcastChannel对象
const version = 'v0_0_1';
const channelName = 'dcwallet_iframe_channel';
import utilHelper from '@/helpers/utilHelper';
import {ethersHelper} from "@/helpers/ethersHelper.js";
const dcWalletChannel = new BroadcastChannel("dcwallet_channel");
let broadcastChannel = null;
let walletLoadedFlag = false; //钱包已加载标志
let waitSignMessage =  null; //等待签名消息
let waitSignEip712Message = null; //等待签名EIP712消息
//获取父窗口域名
const parentOrigin = window.location.ancestorOrigins[0];
// Dapp信息
let appName = '';
let appIcon = '';
let appVersion = '';

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
        } catch (e) {
            console.error('Received invalid message:', event.data);
            return;
        }
    }
    
    /** 判断消息类型,message格式为
     * {
     *      type: 'walletDisconnectedReply', //父窗口发送的消息类型 walletDisconnectedReply, walletConnectedReply, chainChangedReply, accountChangedReply
     *      data: { //消息对应数据
     *         ...
     *     }}
     * 
     **/
    switch (message.type) {
        case 'init': //初始化配置
            initConfig(message.data);
            break;
        case 'connect': //连接命令
            connect();
            break;
        case 'signMessage': //签名消息
            signMessage(message.data);
            break;
        case 'signEIP712Message': //签名EIP712消息
            signEIP712Message(message.data);
            break;
        default:
            break;
    }
});

// Dapp初始化配置
function initConfig(data) {
    // 初始化配置
    let config = JSON.parse(data);
    if (config.appUrl != parentOrigin){
        initConfigResponse(false, 'The appUrl is not equal to the parentOrigin');
    }
    appName = config.appName;
    appIcon = config.appIcon;
    appVersion = config.appVersion;
    createDCWalletIframeBroadcastChannel(channelName);
    if (!broadcastChannel) {
        initConfigResponse(false, 'Your browser does not support BroadcastChannel');
    }else{
        initConfigResponse(true, 'success');
    }
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
      return false;
    });
}


// 父窗口发送的签名消息处理,打开钱包页面前调用
/** message格式为
{
    type: 'string',//string,hex,base64,eip712
    message: 'test message',
}
**/
function signMessage(data) {
    //校验数据
    try {
        let message = JSON.parse(data);
        if (message.type == null || message.message == null) {
            return 'The message type or message is null';
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
function signEIP712Message(data) {
    //校验数据
    try {
        let message = JSON.parse(data);
        if (message.type == null || message.message == null ) {
            return 'The message type or message is null';
        }
        if (message.domain == null){
            return 'The domain is null';
        }
        if (message.primaryType == null){
            return 'The primaryType is null';
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
            requestSignEIP712Message(message);
        } 
    }).catch((e) => {  //超时不处理
        return e;
    });
}











/*******************************发送响应消息给父窗口***********************************/

// 发送初始化结果消息给父窗口
function initConfigResponse(flag, message) {
    let message = {
        type: 'initConfigResponse',
        data: {
            success: flag,
            message: message
        }
    }
    jsonMessage = JSON.stringify(message);
    window.parent.postMessage(jsonMessage, parentOrigin);
}

//发送钱包连接成功消息给父窗口
function walletConnected(successFlag,account, chainId,responseData) {
    let message = {
        type: 'walletConnected',
        data: {
            success: successFlag,
            account: account,
            chainId: chainId,
            responseData: responseData
        }
    }
    jsonMessage = JSON.stringify(message);
    window.parent.postMessage(jsonMessage, parentOrigin);
}

//发送签名成功消息给父窗口
function signMessageResponse(successFlag, message) {
    let message = {
        type: 'signMessageResponse',
        data: {
            success: successFlag,
            message: message
        }
    }
    jsonMessage = JSON.stringify(message);
    window.parent.postMessage(jsonMessage, parentOrigin);
}


//发送签名EIP712成功消息给父窗口
function signEIP712MessageResponse(successFlag, message) {
    let message = {
        type: 'signEIP712MessageResponse',
        data: {
            success: successFlag,
            message: message
        }
    }
    jsonMessage = JSON.stringify(message);
    window.parent.postMessage(jsonMessage, parentOrigin);
}

/*********************************与钱包页面通信处理************************************/

// 发送连接命令给钱包页面
function connectWallet() {
    // 像钱包网页发送连接命令
    let message = {
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
    jsonMessage = JSON.stringify(message);
    dcWalletChannel.postMessage(jsonMessage);
}

// 发送签名消息给钱包页面
function requsetForSignMessage(orignMessage) {
    // 向钱包网页发送签名消息
    let message = {
        version: version,
        type: 'signMessage',
        origin: parentOrigin,
        data: {
            appName: appName,
            appIcon: appIcon,
            appUrl: parentOrigin,
            appversion: appVersion,
            account: orignMessage.account,
            messagetype: orignMessage.type,
            message: orignMessage.message
        }
    }
    waitSignMessage = orignMessage;
    jsonMessage = JSON.stringify(message);
    dcWalletChannel.postMessage(jsonMessage);
}

// 发送签名EIP712消息给钱包页面
function requestSignEIP712Message(orignMessage) {
    // 向钱包网页发送签名消息
    let message = {
        version: version,
        type: 'signEIP712Message',
        origin: parentOrigin,
        data: {
            appName: appName,
            appIcon: appIcon,
            appUrl: parentOrigin,
            appversion: appVersion,
            account: orignMessage.account,
            messagetype: orignMessage.type,
            domain: orignMessage.domain,
            primaryType: orignMessage.primaryType,
            types: orignMessage.types,
            message: orignMessage.message,
        }
    }
    waitSignEip712Message = orignMessage;
    jsonMessage = JSON.stringify(message);
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
        if (message.data.origin == parentOrigin) { 
            walletLoadedFlag = true;
        }
        break;
        //如果是获取用户信息的消息
        case 'connected': //连接成功
            connectResponse(data)
            break;
        case 'signSuccess': //签名成功
            responseForsignMessage(data);
            break;
        case 'signEIP712Success': //签名EIP712成功
            responseForSignEIP712Message(data);
            break
        default:
            break;
    }
}


// 接受钱包页面响应连接消息,data格式为 {success: true, account: '', chainId: '', signature: ''}
function connectResponse(data) {
    try {
       let message = JSON.parse(data); 
       //签名校验,如果校验失败,则不处理
       const flag =  ethersHelper.verifySignature(parentOrigin,message.signature, message.account);
       if (!flag) {
           console.log('verifySignature failed');
            return;
        }
       walletConnected(message.success, message.account, message.chainId, data);
    } catch (e) {
        walletConnected(false, "", "",data);
        return;
    }
}

// 接受钱包页面响应签名消息
function responseForsignMessage(data) {
    try {
        let message = JSON.parse(data);
        if (message.success){
            // 进行签名校验,如果校验失败,则提示父窗口签名失败
            if (waitSignMessage == null) {
                console.log('waitSignMessage is null');
                return;
            }
            if (waitSignMessage.type == 'hex') {
                orignMessage = utilHelper.hexToUint8Array(waitSignMessage.message);
                const flag =  ethersHelper.verifySignature(orignMessage,message.signature, waitSignMessage.account);
                if (!flag) {
                    console.log('verifySignature failed');
                    return;
                }
            }else {
                const flag =  ethersHelper.verifySignature(waitSignMessage.message,message.signature, waitSignMessage.account);
                if (!flag) {
                    console.log('verifySignature failed');
                    return;
                }
            }
        }
        //发送签名成功消息给父窗口
        signMessageResponse(message.success, message.message);
    } catch (e) {
        //发送签名失败消息给父窗口
        signMessageResponse(false, e);
    }
}

// 接受钱包页面响应签名EIP712消息
function responseForSignEIP712Message(data) {
    try {
        let message = JSON.parse(data);
        // 进行签名校验,如果校验失败
        if (waitSignEip712Message == null) {
            console.log('waitSignEip712Message is null');
            return;
        }
        if (message.success){
            const flag =  ethersHelper.verifyEIP712Signature(waitSignEip712Message.primaryType,waitSignEip712Message.domain,
                            waitSignEip712Message.type,waitSignEip712Message.message,message.signature, waitSignEip712Message.account);
            if (!flag) {
                console.log('verifyEIP712Signature failed');
                return;
            }
        }
        //发送签名成功消息给父窗口
        signEIP712MessageResponse(message.success, message.message);
    } catch (e) {
        //发送签名失败消息给父窗口
        signEIP712MessageResponse(false, e);
    }
}


/*********************************其他处理************************************/

//等待标志位变化
function waitForFlagToTrue(getWalletLoadedFlag) {  
    return new Promise((resolve,reject) => {  
        const interval = setInterval(() => {  
            flag = getWalletLoadedFlag();
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

