
import utilHelper from '@/helpers/utilHelper';
import ethersHelper from "@/helpers/ethersHelper";
import {defaultNetworks} from '@/context/constant';

// 定义一个变量，用于存储BroadcastChannel对象
const version = 'v_0_0_1';
let dcWalletIframeChannel = null;
let currentChain = null; //当前网络
let currentAccount = null; //当前账号

// 数据库
import DBHelper from "@/helpers/DBHelper";

// 获取查询字符串  
const queryString = window.location.search;  
const urlParams = new URLSearchParams(queryString);  
let  location = urlParams.get('origin');
const origin = location; 

const NetworkStauts = Object.freeze({  
    connecting: 0,
    connected: 1,
    disconnect: 2 
});  
let networkStatus = NetworkStauts.disconnect; //网络状态

/*******************************初始化需要完成操作***********************************/

// 监听DAPP窗口发送的消息
window.addEventListener('message', function(event) {
    //判断消息来源
    if (event.origin !== origin) {
        return;
    }
    const port2 = event.ports[0]; 
    if (!port2) {
        return;
    }
    if(dcWalletIframeChannel){
        dcWalletIframeChannel.onmessage = null;
        dcWalletIframeChannel.close();
        dcWalletIframeChannel = null;
    }
    dcWalletIframeChannel = port2;
});

//初始化网络列表,并连接最近切换的网络
async function _initNetworks() {
    try {
        let chains = await DBHelper.getAllData(DBHelper.store_chain);
        if (chains.length == 0) {
            for (let i = 0; i < defaultNetworks.networks.length; i++) {
                await DBHelper.addData(DBHelper.store_chain, defaultNetworks.networks[i]);
            }
        }
    }catch(e){
        console.error('初始化网络列表失败:', e);
    }
    if (currentChain == null) {
       //从数据库中获取第一个网络信息
        let chains = await DBHelper.getAllData(DBHelper.store_chain);
        if (chains.length > 0) {
            currentChain = chains[0];
            //连接网络
           const flag = await ethersHelper.connectWithHttps(currentChain.rpcUrl);
            if (!flag) {
                networkStatus = NetworkStauts.disconnect;
            }else{
                networkStatus = NetworkStauts.connected;
            }
        }
    }
    if (currentAccount == null){
        //从数据库中获取第一个账号信息
        let accounts = await DBHelper.getAllData(DBHelper.store_account);
        if (accounts.length > 0) {
            currentAccount = accounts[0];
        }
    }
}




// 初始化基本信息(初始化网络为最近切换的网络,账号为最近切换的账号)
async function _initBaseinfo() {
    try {
        if  (currentChain == null){
            //从数据库中获取上次打开的网络信息
            let netinfo = await  DBHelper.getData(DBHelper.store_keyinfo, 'connectedChain');
            if (netinfo) {
                currentChain = netinfo;
                //连接网络
                let flag = await ethersHelper.connectWithHttps(currentChain.rpcUrl);
                if (!flag) {
                    networkStatus = NetworkStauts.disconnect;
                }else{
                    networkStatus = NetworkStauts.connected;
                }
            }
        }
        if (currentAccount == null){
            //从数据库中获取上次打开的账号信息
            let accountinfo = await DBHelper.getData(DBHelper.store_keyinfo, 'chosedAccount');
            if (accountinfo) {
                currentAccount = accountinfo;
            }
        }
    }catch(e){
        console.error('获取网络信息失败:', e);
    }
    
}

//启动定时器,定时检查网络状态,如果网络状态为断开,则重新连接
let checkCount = 0;
setInterval(async () => {
    if (networkStatus != NetworkStauts.connected) {//如果网络状态为断开,则m每秒检查一次网络状态
       let flag = await ethersHelper.checkNetworkStatus();
       if (flag) {
           networkStatus = NetworkStauts.connected;
           checkCount = 0;
       }
    }else{
        checkCount++;
        if (checkCount > 10) { //每10秒检查一次网络状态
            let flag = await ethersHelper.checkNetworkStatus();
            if (flag) {
                networkStatus = NetworkStauts.connected;
            }else{
                networkStatus = NetworkStauts.disconnect;
            }
            checkCount = 0;
        }
    }
}, 1000);

 

//
function _initCommChannel() {
     //通知DAPP,钱包加载完成
    const message = {
        type: 'walletLoaded',
        data: {
        origin: window.location.origin,
        },
    };
    if (window.opener) {
        window.opener.postMessage(message, origin);
    }
    _waitChannelCreate();
}

function _waitChannelCreate() {
      // 等待dcWalletIframeChannel对象创建完成
    if (!dcWalletIframeChannel) {
        setTimeout(_waitChannelCreate, 100);
        return;
    }
    dcWalletIframeChannel.onmessage = onChannelMessage;
    const message = {
        version: version,
        type: 'loaded',
        origin: origin,
        data: {}
    };
    if (origin != null) {
        dcWalletIframeChannel.postMessage(message);//发送加载成功消息
    }
}

//创建一个BroadcastChannel的监听消息处理函数
function onChannelMessage(event) {
    let message = null;
    // 对消息进行json解析
    message = event.data;
    if (!message) {
        return;
    }
    if (event.ports.length == 0) {
        return;
    }
    if (message.version !== version) {//判断版本号
        return;
    }
    if (message.origin != origin) {//判断消息来源
        return;
    }

    //判断消息类型,message格式为{type: 'getUserInfo', data: {}}
    switch (message.type) {
        case 'connect': //连接钱包请求 
            _connectCmdHandler(message, true,event.ports[0]);
            break;
        case 'signMessage': //签名请求
            signMessageHandler(message,event.ports[0]);
            break;
        case 'signEIP712Message': //签名EIP712请求
            signEIP712MessageHandler(message,event.ports[0]);
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
    try{
        //判断用户是否已经创建过钱包账号,如果没有,则跳出状态等待框,提示用户账号创建中
        accounts = await DBHelper.getAllData(DBHelper.store_account);
        if(!accounts){
            accounts = [];
        }
        if (accounts.length === 0) {
            //todo 跳出状态等待框,提示用户账号创建中
            let account = await createWalletAccount();
            //todo 关闭状态等待框
            if (!account){
                //todo 跳出提示框,提示用户创建账号失败
                return;

            }
            
            //todo 跳出账号创建成功提示框
            accounts.push(account);
        }
    }catch(e){
        console.error('获取账号信息失败:', e);
        //todo 跳出提示框,提示用户创建账号失败
        return;
    }
    if (accounts.length > 1) {
        //todo 跳出选择账号框,让用户选择账号
        return;
    }
    return accounts[0];
}

// 收到连接钱包请求处理,message格式为{version:'v_0_0_1',type: 'connect',data: {appname:'test',appIcon:'',appUrl: 'http://localhost:8080',appVersion: '1.0.0'}}
async function _connectCmdHandler(message, bool,port = null) {
    if(!bool){
        return;
    }
    let connectingApp = message.data;
    let choseedAccount = await checkAccountAndCreate();
    // 取出网络列表
    let chains = [];
    try {
        chains = await DBHelper.getAllData(DBHelper.store_chain);
    } catch (e) {
        console.error('获取网络信息失败:', e);
        //todo 跳出提示框,提示用户获取网络信息失败
        return;
    }
    if (currentChain == null){//如果当前网络为空,则取第一个网络
        currentChain = {
            chainId: chains[0].chainId,
            name: chains[0].name,
            rpcUrl: chains[0].rpcUrl,
            desc: chains[0].desc,
            confirms: chains[0].confirms,//确认数
        };
    }
    if (ethersHelper.jsonRpcProvider != null ) {       // 获取网络信息  
        const network = await provider.getNetwork();  
        if (network.chainId != currentChain.chainId) {
            providerChainId = network.chainId;
            // 将jsonRpcProvider网络切换到当前网络
            for (let i = 0; i < chains.length; i++) {
                if (chains[i].chainId == providerChainId) {
                    currentChain = {
                        chainId: chains[i].chainId,
                        name: chains[i].name,
                        rpcUrl: chains[i].rpcUrl,
                        desc: chains[i].desc,
                        confirms: chains[i].confirms,//确认数
                    };
                    break;
                }
            }
        }
        return;
    }
    //todo 异步获取当前网络状态,更新钱包网络状态
 
    //todo 账号存在后,跳出授权框,提示用户授权连接对应的APP(这个界面可以切换网络)

    //用户确认后,调出webauthn进行校验,并提取出userHandleHash
    const userHandleHash = await authenticateWithPasskey(choseedAccount.credentialid);
    if (!userHandleHash) {
        //todo 跳出提示框,提示用户授权失败
         // 关闭当前窗口,并返回原来的窗口
        if (window.opener) {  
            // 可以在原窗口中执行一些操作，例如导航  
            window.opener.focus(); // 返回并聚焦到原窗口  
        }  
        window.close();
        return;
    }
    //解密出助记词
    const cryptoKey = await importAesKeyFromHash(userHandleHash);
    const encodedMnemonic = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: choseedAccount.iv,
        },
        cryptoKey,
        choseedAccount.mnemonic
    );
    const decoder = new TextDecoder();  
    const mnemonic = decoder.decode(encodedMnemonic); 
    // 通过助记词导入钱包,生成带私钥钱包账号
    const wallet = await ethersHelper.createWalletAccountWithMnemonic(mnemonic);
    if (!wallet) {
        //todo 跳出提示框,提示用户导入钱包失败
        return;
    }
    // 执行签名
    const signature = await ethersHelper.signMessage(wallet,message.origin);
    if (!signature) {
        //todo 跳出提示框,提示用户签名失败
        return;
    }
    if(bool){ // DCAPP进入
        //签名成功后,发送链接成功消息给APP
        const resMessage = {
            version: version,
            type: 'connected',
            origin: origin,
            data: {
                success: true,
                account: wallet.address,
                chainId: currentChain.chainId,
                chainName: currentChain.name,
                signature: signature,
            }
        };
        if(!port){
            console.error('messagePort is null');
            // 关闭当前窗口,并返回原来的窗口
            if (window.opener) {  
                // 可以在原窗口中执行一些操作，例如导航  
                window.opener.focus(); // 返回并聚焦到原窗口  
            }  
            window.close();
            return
        }
        port.postMessage(resMessage);
        // 1秒后关闭port
        setTimeout(() => {
            port.close();
        }, 1000);
        // 连接记录存储到数据库
        const app = {
            appName: connectingApp.appName,
            appIcon: connectingApp.appIcon,
            appUrl: connectingApp.appUrl,
            appVersion: connectingApp.appVersion,
            timestamp: new Date().getTime(),
        };
        DBHelper.updateData(DBHelper.store_apps, app).then(() => {
            console.log('连接记录存储成功');
            }
        ).catch((e) => {
            console.error('连接记录存储失败:', e);
        }).finally(() => {
            // 关闭当前窗口,并返回原来的窗口
            if (window.opener) {  
                // 可以在原窗口中执行一些操作，例如导航  
                window.opener.focus(); // 返回并聚焦到原窗口  
            }  
            window.close();
        });
    }else { // 钱包本身访问
        return {
            success: true,
            account: wallet.address,
            chainId: currentChain.chainId,
            name: currentChain.name,
            signature: signature,
        }
    }
}



// 根据账号,生成签名的钱包账号对象
async function generateWalletAccount(seedAccount) {
    let account = null;
    // 数据库里获取账号信息
    try {
        account = await DBHelper.getData(DBHelper.store_account, seedAccount);
        if (account == null) {
            //todo 跳出提示框,提示钱包里的用户账号不存在
            return null;
        }
    } catch (e) {
        console.error('获取账号信息失败:', e);
        //todo 跳出提示框,提示用户获取账号信息失败
        return null ;
    }
    //todo 跳出授权框,提示用户进行签名(显示所有签名信息,以及签名申请的APP信息)
    //用户确认后,调出webauthn进行校验,并提取出userHandleHash
    const userHandleHash = await authenticateWithPasskey(account.credentialid);
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
    version:'v_0_0_1',
    type: 'signMessage', 
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
async function signMessageHandler(message,port=null) {
    const data = message.data;
    if (data.account == null) {//没有签名账号,不做处理
        return;
    }

   const wallet = await generateWalletAccount(data.account);
    if (!wallet) {
         return;
    }
   let signature = null;
   if (data.messageType == 'hex') {
        waitSignMessage = utilHelper.hexToUint8Array(data.message);
        // 执行签名
       signature = await ethersHelper.signMessage(wallet,waitSignMessage);
        if (!signature) {
            //todo 跳出提示框,提示用户签名失败
            return;
        }
    }else {
        // 执行签名
        signature = await ethersHelper.signMessage(wallet,data.message);
        if (!signature) {
            //todo 跳出提示框,提示用户签名失败
            return;
        }
    }
   
    //签名成功后,发送签名成功消息给APP,并返回签名结果
    const resMessage = {
        version: version,
        type: 'signSuccess',
        origin: origin,
        data: {
            success: true,
            account: wallet.address,
            chainId: currentChain.chainId,
            name: currentChain.name,
            signature: signature,
        }
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
//     version:'v_0_0_1',
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
//                     wallet: '0xCD2a3d9F
//                 },
//                 to: {
//                     name: 'Bob',
//                     wallet: '0xbBbBBBBbb
//                 },
//                 contents: 'Hello, Bob!'
//             }
//         }
// }
async function signEIP712MessageHandler(message,port=null) {
    const data = message.data;
    if (data.account == null) {//没有签名账号,不做处理
        return;
    }
    const wallet = await generateWalletAccount(data.account);
    if (!wallet) {
         return;
    }
    // 执行签名
    const signature = await ethersHelper.signEIP712Message(wallet,data.primaryType,data.domain,data.types,data.message);
     if (!signature) {
         //todo 跳出提示框,提示用户签名失败
        return;
    }
    //签名成功后,发送签名成功消息给APP,并返回签名结果
    const resMessage = {
        version: version,
        type: 'signEIP712Success',
        origin: origin,
        data: {
            success: true,
            account: wallet.address,
            chainId: currentChain.chainId,
            name: currentChain.name,
            signature: signature,
        }
    };
    if(port){
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
async function addChain(chainInfo) {
    if (chainInfo == null ) {
        return;
    }
    if (chainInfo.confirms == null || chainInfo.confirms == 0) {
        chainInfo.confirms = 6;
    }
    try {
        await DBHelper.addData(DBHelper.store_chain, chainInfo);
        return true;
    }catch(e){
        console.error('添加网络失败:', e);
        return false;
    }
}


//修改网络
async function updateChain(chainInfo) {
    if (chainInfo == null ) {
        return;
    }
    if (chainInfo.confirms == null || chainInfo.confirms == 0) {
        chainInfo.confirms = 6;
    }
    try {
        await DBHelper.updateData(DBHelper.store_chain, chainInfo);
        return true;
    }catch(e){
        console.error('修改网络失败:', e);
        return false;
    }
}

// 切换网络
async function _switchChain(chainInfo) {
    try {
        DBHelper.updateData(DBHelper.store_keyinfo, {key: 'connectedChain', value: currentChain});
        currentChain = chainInfo;
        //连接网络
        let flag = await ethersHelper.connectWithHttps(currentChain.rpcUrl);
        if (!flag) {
            networkStatus = NetworkStauts.disconnect;
            return;
        }else{
            networkStatus = NetworkStauts.connected;
        }
        return true;
    }catch(e){
        console.error('切换网络失败:', e);
        return false;
    }
}

// 转账
async function transfer(to, amount,gasLimit,gasPrice) {
    if (currentChain == null || networkStatus != NetworkStauts.connected) {
        //todo 跳出提示框,提示用户未连接钱包
        return;
    }
    if (currentAccount == null ) {
        //todo 跳出提示框,提示用户没有可用账号
        return;
    }
    const wallet = await generateWalletAccount(currentAccount.account);
    if (!wallet) {
        return;
    }
    // 执行转账
    const txResponse = await ethersHelper.transfer(wallet,to,amount,gasLimit,gasPrice);
    if (!txResponse || !txResponse.hash || !txResponse.Proverder) {
        //todo 跳出提示框,提示用户转账失败
        return;
    }
    let record = {
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
        contractAddress: '',
        status: 2,//0:失败,1:成功,2:等待确认
        timestamp: new Date().getTime(),
    };
    DBHelper.updateData(DBHelper.store_record, record);
    //等待转账成功
    const receipt = await ethersHelper.waitTransactionConfirm(txResponse, currentChain.confirms);
    if (!receipt) {
        //todo 界面提示用户转账待确认
        return;
    }
    record.gasUsed = receipt.gasUsed;
    record.blobGasUsed = receipt.blobGasUsed;
    record.status = 1;
    record.timestamp = new Date().getTime();
    DBHelper.updateData(DBHelper.store_record, record);
    //todo 界面提示转账成功
}

//刷新指定交易记录状态,用户点击状态为等待中的交易记录时,调用此方法
async function refreshRecordStatus(hash) {
    //从数据库中获取交易记录
    let record = await DBHelper.getData(DBHelper.store_record, hash);
    if (!record) {
        //todo 跳出提示框,提示用户获取交易记录失败
        return;
    }
    if (currentChain == null || currentChain.chainId != record.chainId) {
        //跳出提示框,开始切换网络
        //数据库查出网络信息
        let chainInfo = await DBHelper.getData(DBHelper.store_chain, record.chainId);
        const flag = _switchChain(chainInfo);
        if (!flag) {
            //todo 跳出提示框,提示用户切换网络失败
            return;
        } 
    }
    const receipt =  await ethersHelper.checkTransactionStatus(hash)
    record.gasUsed = receipt.gasUsed;
    record.blobGasUsed = receipt.blobGasUsed;
    record.status = receipt.status;
    record.timestamp = new Date().getTime();
    DBHelper.updateData(DBHelper.store_record, record);
}




// 创建钱包账号
async function createWalletAccount() {
    let resAccount = {};
    let accountInfo = await ethersHelper.createWalletAccount();
    if (accountInfo) {
        try {
             //调用webauthn进行账号信息加密,并存储到数据库
            const credential =  await registerPasskey();
            // 提取 response 对象  
            const userHandle = credential.userHandle;  
            // 提取 userHandle 并进行 hash
            let userHandleHash = await crypto.subtle.digest('SHA-256',userHandle); 
            //用userHandleHash 生成aes256的密钥,来加密accountInfo.mnemonic
            const cryptoKey = await importAesKeyFromHash(userHandleHash); 
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encryptedMnemonic = await crypto.subtle.encrypt(
                {
                    name: "AES-GCM",
                    iv: iv,
                },
                cryptoKey,
                new TextEncoder().encode(accountInfo.mnemonic.phrase)
            );
            //将账号信息(助记词)存储到数据库
            const account = {
                account: accountInfo.address,
                type: 'eth',
                credentialid: credential.id,
                mnemonic: encryptedMnemonic,
                iv: iv,
                name: accountInfo.address.substring(0,6),
                timeStamp: new Date().getTime(),
            };
            resAccount = account;
            DBHelper.updateData(DBHelper.store_account, account).then(() => {
                console.log('账号信息存储成功');
                }
            );
            return resAccount;
        }catch(e){
            console.error('账号信息加密失败:', e);
            return null;
        }
    }else{
        return null;
    }
}




async function importAesKeyFromHash(userHandleHash) {  
    // Convert the userHandleHash (32-byte) into a CryptoKey object  
    return await crypto.subtle.importKey(  
        "raw",               // Raw format of the key  
        userHandleHash,      // The ArrayBuffer or TypedArray  
        { name: "AES-GCM" }, // Algorithm to use for the key  
        false,               // Not extractable  
        ["encrypt", "decrypt"] // Key usages  
    );  
}  

 // 注册新的 Passkey
 async function registerPasskey() {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    //生成可识别的时间戳:格式为2021-01-01 12:00:00
    const timestamp = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
    const userHandle  = crypto.getRandomValues(new Uint8Array(32));
    const createCredentialOptions = {
        challenge: challenge,
        rp: {
            name: "DCWallet",
            id:  window.location.hostname
        },
        user: {
            id: userHandle,
            name: timestamp,
            displayName: timestamp
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
        },
        timeout: 60000,
        attestation: "direct"
    };

    try {
        const credential = await navigator.credentials.create({
            publicKey: createCredentialOptions
        });
        console.log("Passkey registered successfully");
        return {id: credential.id, userHandle: userHandle};
    } catch (error) {
        console.error("Passkey registration failed", error);
        throw error;
    }
}


  // 使用 Passkey 进行身份验证,并提取出userHandleHash
  async function authenticateWithPasskey(credentialid) {
    const challenge = window.crypto.getRandomValues(new Uint8Array(32));

    const getCredentialOptions = {
        challenge: challenge,
        rpId: window.location.hostname,
        allowCredentials: [{
            id: utilHelper.base64UrlToArrayBuffer(credentialid),
            type: 'public-key',
        }],
        userVerification: "required",
        timeout: 60000
    };

    try {
        const assertion = await navigator.credentials.get({
            publicKey: getCredentialOptions
        });
        if (!assertion) {
            return null;
        }
        console.log("Authentication successful");
        const userHandleHash = await crypto.subtle.digest('SHA-256', assertion.response.userHandle);
        return userHandleHash;
    } catch (error) {
        console.error("Authentication failed", error);
        return null;
    }
}

const _getCurrentNetwork = () => {
    return currentChain;
}


const _getCurrentAccount = () => {
    return currentAccount;
}

export const initBaseinfo = _initBaseinfo;
export const initNetworks = _initNetworks;
export const connectCmdHandler = _connectCmdHandler;
export const getCurrentNetwork = _getCurrentNetwork;
export const getCurrentAccount = _getCurrentAccount;
export const switchChain = _switchChain;
export const initCommChannel = _initCommChannel;