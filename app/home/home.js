
import IndexedDBHelper from './indexedDBHelper.js';  
// 定义一个变量，用于存储BroadcastChannel对象
const version = 'v_0_0_1';
const channelName = 'dcwallet_channel';
let broadcastChannel = null;
let state = ""; //存储钱包状态
var validOrigins = []; //存储合法的origin
const dbname = 'dcwallet';
const store_account = 'walletaccount';
const store_chain = 'walletchain';
const store_record = 'transferrecods';
const store_apps = 'walletapps';
const store_keyinfo = 'walletkeyinfo';
const dbversion = 1;
let dbInstance = null; // 全局变量，用于存储数据库实例 

// 获取查询字符串  
const queryString = window.location.search;  

// 使用 URLSearchParams 解析查询字符串  
const urlParams = new URLSearchParams(queryString);  

// 获取特定参数的值  
const origin = urlParams.get('origin'); // 
 


//todo 向iframe发送加载成功消息

/*******************************初始化需要完成操作***********************************/

// 初始化数据库并设置全局变量  
async function initializeDatabase() {  
    const storeConfigs = [  
        {  // 账号信息存储,
            name: 'store_account',  
            keyPath: 'account',  
            autoIncrement: false,
            indexes: [{ name: 'type', keyPath: 'type', unique: false }]  
        },  
        {  // 网络信息存储
            name: 'walletchain',  
            keyPath: 'chainid',  
            autoIncrement: false,  
            indexes: [{ name: 'chainid', keyPath: 'chainid', unique: true }]  
        },
        {// 转账记录存储
            name: 'transferrecods',  
            keyPath: 'id',  
            autoIncrement: true,  
            indexes: [{ name: 'account', keyPath: 'account', unique: false },{ name: 'chainid', keyPath: 'chainid', unique: false }]  
        },
        {// 已连接的DAPP存储
            name: 'store_apps',  
            keyPath: 'id',  
            autoIncrement: true,  
            indexes: [{ name: 'timestamp', keyPath: 'timestamp', unique: false }]  
        },
         {// key信息存储,主要用来存储经webauthn过程中唯一信息加密的私钥的信息,一般就一条数据
            name: 'store_keyinfo',  
            keyPath: 'key',   
        },
    
    ];  
    const dbHelper = new IndexedDBHelper('myDatabase', storeConfigs);  

    try {  
        dbInstance = await dbHelper.open();  
        console.log('数据库已打开:', dbInstance);  
    } catch (error) {  
        console.error('数据库初始化失败:', error);  
    }  
}  

// 调用初始化函数  
await initializeDatabase(); 



//写一个方法创建broadcastChannel
function createBroadcastChannel(name) {
    //如果支持BroadcastChannel，直接返回
    if (window.BroadcastChannel) {
        //如果已经创建过，直接返回
        if (broadcastChannel) {
            return broadcastChannel;
        }
        broadcastChannel = new BroadcastChannel(name);
        broadcastChannel.onmessage = onChannelMessage;
        const message = {
            version: version,
            type: 'loaded',
            data: {origin:origin}
        };
        broadcastChannel.postMessage(JSON.stringify(message));//发送加载成功消息
        //如果没有创建过，创建一个新的BroadcastChannel对象
        return broadcastChannel;
    }
    //如果不支持，提示错误
    console.error('Your browser does not support BroadcastChannel');
    return null;
}

//创建一个BroadcastChannel的监听消息处理函数
function onChannelMessage(event) {
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
    if (message.version !== version) {//判断版本号
        return;
    }
    //判断消息类型,message格式为{type: 'getUserInfo', data: {}}
    switch (message.type) {
        case 'connect': //连接钱包请求 
            connectCmdHandler(message);
            break;
        case 'signmessage': //签名请求
            signMessageHandler(message);
            break;
        default:
            break;
    }
}



// 收到连接钱包请求处理,message格式为{version:'v_0_0_1',type: 'connect',data: {appname:'test',appIcon:'',appurl: 'http://localhost:8080',appVersion: '1.0.0'}}
function connectCmdHandler(message) {
    connectingApp = message.data;
    //todo 判断用户是否已经创建过钱包账号,如果没有,则跳出状态等待框,提示用户账号创建中

    //todo 账号存在后,跳出授权框,提示用户授权连接对应的APP(这个界面可以切换网络)
    //todo 用户确认后,调出webauthn进行授权
    //todo 授权成功后,发送连接成功消息给APP,并返回用户信息(网络,账号,公钥)
    //todo 返回原来的窗口,并关闭当前窗口
}

/** 收到签名请求处理,message格式为
{
    version:'v_0_0_1',
    type: 'signMessage', 
    data: {
            appname:'test',
            appIcon:'',
            appurl: 'http://localhost:8080',
            appVersion: '1.0.0',
            messagetype: 'string',//string,hex,base64,eip712
            message: 'test message',
        }
}
**/
function signMessageHandler(message) {
    //todo 显示要签名的消息(string类型直接签名,hex,base64 转换后签名,eip712需要转json格式,校验后签名),以及签名申请的APP信息
    //todo 用户确认后,调出webauthn进行签名
    //todo 签名成功后,发送签名成功消息给APP,并返回签名结果
    //todo 返回原来的窗口,并关闭当前窗口
}