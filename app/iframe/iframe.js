
// 定义一个变量，用于存储BroadcastChannel对象
const version = 'v0_0_1';
const channelName = 'dcwallet_iframe_channel';
const dcWalletChannel = new BroadcastChannel("dcWalletChannel");
let broadcastChannel = null;
let walletLoadedFlag = false; //钱包已加载标志
let validRandom = ''; //连接校验随机数
let waitSignMessage =  ''; //等待签名消息
//获取父窗口域名
const parentOrigin = window.location.ancestorOrigins[0];
// Dapp信息
let appName = '';
let appIcon = '';
let appUrl = '';
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
            connect(message.data);
            break;
        case 'signMessage': //签名消息
            signMessage(message.data);
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
    appUrl = config.appUrl;
    appVersion = config.appVersion;
    createDCWalletIframeBroadcastChannel(channelName);
    if (!broadcastChannel) {
        initConfigResponse(false, 'Your browser does not support BroadcastChannel');
    }else{
        initConfigResponse(true, 'success');
    }
}


// 父窗口发送的连接命令处理,打开钱包页面前调用
function connect(radomdata) {
    // 等待钱包加载完成
    walletLoadedFlag = false;
    waitForFlagToTrue(() => walletLoadedFlag)
    .then((flag) => { //钱包已经加载完成
        if (flag) {
            connectWallet(radomdata);
        } 
    }).catch((error) => {  //超时不处理
      
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
            signMessage(message);
        } 
    }).catch((error) => {  //超时不处理
      
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
            chainid: chainId,
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

/*********************************与钱包页面通信处理************************************/

// 发送连接命令给钱包页面
function connectWallet(radomdata) {
    validRandom = radomdata;
    // 像钱包网页发送连接命令
    let message = {
        version: version,
        type: 'connect',
        data: {
            appName: appName,
            appIcon: appIcon,
            appUrl: parentOrigin,
            random: radomdata,
            appversion: appVersion
        }
    }
    jsonMessage = JSON.stringify(message);
    dcWalletChannel.postMessage(jsonMessage);
}

// 发送签名消息给钱包页面
function signMessage(orignMessage) {
    // 向钱包网页发送签名消息
    let message = {
        version: version,
        type: 'signMessage',
        data: {
            appName: appName,
            appIcon: appIcon,
            appUrl: parentOrigin,
            appversion: appVersion,
            messagetype: orignMessage.type,
            message: orignMessage.message
        }
    }
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
        case 'signsuccess': //签名成功
        default:
            break;
    }
}


// 接受钱包页面响应连接消息,data格式为 {success: true, account: '', chainid: '', signature: ''}
function connectResponse(data) {
    try {
       let message = JSON.parse(data); 
       //todo 利用ether.js随机数签名校验,如果校验失败,则提示父窗口连接失败
       

       walletConnected(message.success, message.account, message.chainid, data);
    } catch (e) {
        walletConnected(false, "", "",data);
        return;
    }
}

// 接受钱包页面响应签名消息
function signMessageResponse(data) {
    try {
        let message = JSON.parse(data);
        //todo 利用ether.js签名校验,如果校验失败,则提示父窗口签名失败
        //发送签名成功消息给父窗口
        signMessageResponse(message.success, message.message);
    } catch (e) {
        //发送签名失败消息给父窗口
        signMessageResponse(false, e);
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