"use client";
// 定义一个变量，用于存储BroadcastChannel对象
const version = 'v_0_0_1';
const walletOrigin = 'http://localhost:3000'; // 钱包地址
const walletUrl = walletOrigin +'/'+version; // 钱包地址

import utilHelper from '@/helpers/utilHelper';
import ethersHelper from "@/helpers/ethersHelper";

// Dapp信息
const localStorageKey_dcwallet_opener = 'dcwallet_opener';
const localStorageKey_recent_account = 'dcwallet_recent_account';
const localStorageKey_recent_chain = 'dcwallet_recent_chain';
let appName = '';
let appIcon = '';
let appVersion = '';

// 将dcwallet_opener的值设置为true,并存入localStorage
localStorage.setItem('dcwallet_opener', 'false');

// 初始化DAPP
const initDAPP = function(appName:string,appIcon:string,appVersion:string) {
    if (appName == '' ) {
        console.error('appName is null');
        return false;
    }
    appName = appName;
    appIcon = appIcon;
    appVersion = appVersion;
    return true;
}


type ConnectReqMessage = {
    version: string,
    type: string,
    origin: string,
    data: {
        appName: string,
        appIcon: string,
        appUrl: string,
        appVersion: string,
        account: string,
        chainId: string,
    }
}

type ConnectResponse = {
    success: boolean,
    account: string,
    chainId: string,
    chainName: string,
}


// 连接钱包
const connectWallet = async (timeout:number,account:string = "",chainId:string = ""):Promise<ConnectResponse> => {
    return new Promise<ConnectResponse>((resolve,reject) => {
        if (appName == '' ) {
            reject('appName is null,please init first');
            return;
        }
        const urlWithOrigin = walletUrl+'?origin='+window.location.origin;
        const walletWindow = window.open(urlWithOrigin, '_blank'); 
        waitForWalletLoaded(timeout).then((flag) => {
            if (flag) {
                // 像钱包网页发送连接命令
                const message = {
                    version: version,
                    type: 'connect',
                    origin: window.location.origin,
                    data: {
                        appName: appName,
                        appIcon: appIcon,
                        appUrl: window.location.origin,
                        appVersion: appVersion,
                        account: account,
                        chainId: chainId,
                    }
                }
                //创建新的messageChannel
                sendMessageToWallet(walletWindow,message,timeout).then((event) => {
                    const message = event.data;
                     //签名校验,如果校验失败,则不处理
                    const flag =  ethersHelper.verifySignature(window.location.origin,message.signature, message.account);
                    if (!flag) {
                        const connectResponse = {
                            success: false,
                            account: "",
                            chainId: "",
                            chainName: "",
                        };
                        resolve(connectResponse);
                        return ;
                    }
                    const connectResponse = {
                        success: message.success,
                        account: message.account,
                        chainId: message.chainId,
                        chainName: message.chainName,
                    }
                    //保存最近连接的账号
                    localStorage.setItem(localStorageKey_recent_account, message.account);
                    //保存最近连接的链
                    const chaininfo = message.chainId + '$$$$' + message.chainName;
                    localStorage.setItem(localStorageKey_recent_chain, chaininfo);
                    resolve(connectResponse);
                }).catch((e) => {
                    reject(e);
                });
            }else{
                reject('timeout');
            }
        });
    });
  }


type NeedSignMessage = {
    version: string,
    type: string,
    origin: string,
    data: {
        appName: string,
        appIcon: string,
        appUrl: string,
        appVersion: string,
        account: string,
        messageType: string,
        message: string,
    }
}


type SignMessageResponse = {
    version: string,
    type: string,
    origin: string,
    data: {
        success: boolean,
        account: string,
        signature: string,
    }
}

// 签名消息
const signMessage = async (message:string,account:string,timeout:number,messageType:string='string'):Promise<SignMessageResponse> => {
    return new Promise<SignMessageResponse>((resolve,reject) => {
        if (appName == '' ) {
            reject('appName is null,please init first');
            return;
        }
        if (account == '') {
            reject('account is null,please connect first');
            return;
        }
        if (message == '') {
            reject('message is null');
            return;
        }
        if (messageType != 'string' && messageType != 'hex') {
            reject('messageType is invalid,please input string or hex');
            return;
        }
        const urlWithOrigin = walletUrl+'?origin='+window.location.origin;
        const walletWindow = window.open(urlWithOrigin, '_blank'); 
        waitForWalletLoaded(timeout).then((flag) => {
            if (flag) {
                // 像钱包网页发送命令
                const sendMessage = {
                    version: version,
                    type: 'signMessage',
                    origin: window.location.origin,
                    data: {
                        appName: appName,
                        appIcon: appIcon,
                        appUrl: window.location.origin,
                        appVersion: appVersion,
                        account: account,
                        messageType: messageType,
                        message: message,
                    }
                }
                //创建新的messageChannel
                sendMessageToWallet(walletWindow,sendMessage,timeout).then((event) => {
                    const message = event.data;
                    let resMesage = {
                        version: message.version,
                        type: message.type,
                        origin: message.origin,
                        data: {
                            success: message.data.success,
                            account:message.data.account,
                            signature: message.data.signature,
                        }
                    }
                    //校验
                    const flag =  verifySignMessageResponse(sendMessage,resMesage);
                    if (!flag) {
                        reject('verifySignature failed');
                        return;
                    }
                    resolve(resMesage);
                }).catch((e) => {
                    reject(e);
                });
            }else{
                reject('timeout');
            }
        });
    });
}


// 签名消息验证
 function verifySignMessageResponse(orignMessage:NeedSignMessage,resMessage:SignMessageResponse):boolean {
        if (resMessage.data.success){
            const waitData = orignMessage.data.message;
            if (orignMessage.type == 'hex') {
                const needSignData = utilHelper.hexToUint8Array(waitData);
                const flag =  ethersHelper.verifySignature(needSignData,resMessage.data.signature, orignMessage.data.account);
                return flag;
            }else {
                const flag =   ethersHelper.verifySignature(waitData,resMessage.data.signature, orignMessage.data.account);
                return flag;
            }
        }else{
            return false;
        }
}



type EIP712SignReqMessage = {
    version: string,
    type: string,
    origin: string,
    data: {
        account: string,
        appName:string,
        appIcon:string,
        appUrl: string,
        domain: any,
        types: any,
        primaryType: string,
        message: any,
    }
}


// 签名EIP712消息
const signEIP712Message = async (message:string,account:string,domain:any,primaryType:string,types:any,timeout:number):Promise<SignMessageResponse> => {
    return new Promise<SignMessageResponse>((resolve,reject) => {
        if (appName == '' ) {
            reject('appName is null,please init first');
            return;
        }
        if (account == '') {
            reject('account is null,please connect first');
            return;
        }
        if (message == null) {
            reject('message is null');
            return;
        }
        if (domain == null) {
            reject('domain is null');
            return;
        }
        if (primaryType == '') {
            reject('primaryType is null');
            return;
        }
        if (types == null) {
            reject('types is null');
            return;
        }
        const urlWithOrigin = walletUrl+'?origin='+window.location.origin;
        const walletWindow = window.open(urlWithOrigin, '_blank'); 
        waitForWalletLoaded(timeout).then((flag) => {
            if (flag) {
                // 像钱包网页发送命令
                const sendMessage = {
                    version: version,
                    type: 'signEIP712Message',
                    origin: window.location.origin,
                    data: {
                        appName: appName,
                        appIcon: appIcon,
                        appUrl: window.location.origin,
                        appVersion: appVersion,
                        account: account,
                        domain: domain,
                        primaryType: primaryType,
                        types: types,
                        message: message,
                    }
                }
                //创建新的messageChannel
                sendMessageToWallet(walletWindow,sendMessage,timeout).then((event) => {
                    const message = event.data;
                    let resMesage = {
                        version: message.version,
                        type: message.type,
                        origin: message.origin,
                        data: {
                            success: message.data.success,
                            account:message.data.account,
                            signature: message.data.signature,
                        }
                    }
                    //校验
                    const flag =  verifySignEip712MessageResponse(sendMessage,resMesage);
                    if (!flag) {
                        reject('verifyEIP712Signature failed');
                        return;
                    }
                    resolve(resMesage);
                }).catch((e) => {
                    reject(e);
                });
            }else{
                reject('timeout');
            }
        }
        );
    }
    );
}


// Eip712签名消息验证
function verifySignEip712MessageResponse(orignMessage:EIP712SignReqMessage,resMessage:SignMessageResponse):boolean {
    if (resMessage.data.success){
        const waitData = orignMessage.data;
        const flag =  ethersHelper.verifyEIP712Signature(waitData.primaryType,waitData.domain,
            waitData.types,waitData.message,resMessage.data.signature, waitData.account);
        return flag;
    }else {
        return false;
    }
}



  //等待钱包页面加载完成
    const waitForWalletLoaded = async (timeout:number) => {
        // localStorage中获取是否支持window.opener
        const openerFlag = localStorage.getItem(localStorageKey_dcwallet_opener);
        let waitTimeCount = 6;
        if (openerFlag == 'true') {
            waitTimeCount = 10;
        }
        // 开启定时器500ms检查一次,第一次等待3秒,如果没有加载完成,则发送轮询请求
        return new Promise((resolve) => {
            let walletLoadedFlag = false;
            let exitFlag = false;
            const messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = (event) => {
                const message = event.data;
                if (message.type === 'walletLoaded') {
                    clearInterval(interval);
                    clearTimeout(timeoutHandle);
                    window.removeEventListener('message',function(){});//移除监听事件
                    messageChannel.port1.close();
                    resolve(true);
                }
            }
            const listenForWalletLoaded = (event:MessageEvent) => {
                //判断消息来源
                if (event.origin !== walletOrigin ) {
                    return;
                }
                try {
                    const data = event.data;
                    if (!data.type ) {
                      //非钱包插件
                      return;
                    }
                    if (data.type === 'walletLoaded') {//钱包加载完成
                        walletLoadedFlag = true;
                        clearInterval(interval);
                        clearTimeout(timeoutHandle);
                        messageChannel.port1.close();
                        //移除监听事件
                        window.removeEventListener('message',listenForWalletLoaded);
                        localStorage.setItem(localStorageKey_dcwallet_opener, 'true');
                        resolve(true);
                    }
                  } catch (error) {
                    console.error('message error', error);
                  }
            }
            //添加监听事件
            window.addEventListener('message', listenForWalletLoaded);
            const checkMessage = {
                version: version,
                type: 'checkWalletLoaded',
                data: {
                    origin: window.location.origin,
                }
            }
            const interval = setInterval(() => {
                if (walletLoadedFlag) {
                    clearInterval(interval);
                    messageChannel.port1.close();
                }else {
                    if (waitTimeCount >= 0) {
                        waitTimeCount--;
                    }else{
                        try{
                            window.postMessage(checkMessage,walletOrigin,[messageChannel.port2]);
                        }catch (e) {//不做处理
                        }
                    }
                }
            },500);
            //添加超时处理
            const timeoutHandle =  setTimeout(() => {
                clearInterval(interval);
                window.removeEventListener('message',listenForWalletLoaded);//移除监听事件
                messageChannel.port1.close();
                resolve(false);
            },timeout);
        });
    }


 // 通信,发送消息给钱包页面并等待返回
 const sendMessageToWallet = async (walletWindow:Window | null,message:NeedSignMessage|ConnectReqMessage|EIP712SignReqMessage,timeout:number) =>  {
    const messageChannel = new MessageChannel();
    return  new Promise<MessageEvent>((resolve, reject) => {
        const timer = setTimeout(() => {
            reject('timeout');
        }, timeout);
        messageChannel.port1.onmessage = (event) => {
            clearTimeout(timer);
            messageChannel.port1.close();
            resolve(event);
        }
        try {
            if (walletWindow == null) {
                reject('walletWindow is null');
                return 
            }
            walletWindow.postMessage(message,walletUrl,[messageChannel.port2]);
        }catch (e) {
            clearTimeout(timer);
            messageChannel.port1.close();
            reject(e);
        }
    });
  }


// 获取最近链接的账号
const getRecentConnectAccount = () => {
    const account = localStorage.getItem(localStorageKey_recent_account);
    return account;
}

// 获取最近链的信息
const getRecentChain = () => {
    const chaininfo = localStorage.getItem(localStorageKey_recent_chain);
    //分解出chainId和chainName,$$$$分隔
    if (chaininfo) {
        const chainArr = chaininfo.split('$$$$');
        const chain = {
            chainId: chainArr[0],
            chainName: chainArr[1],
        }
        return chain;
    }else{
        return null;
    }
}

export default {
    initDAPP,
    connectWallet,
    signMessage,
    signEIP712Message,
    getRecentConnectAccount,
    getRecentChain,
}