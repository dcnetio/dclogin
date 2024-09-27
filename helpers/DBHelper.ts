import IndexedDBHelper from "./indexedDBHelper";

/**
 * DB
 */
const dbname = 'dcwallet';
const _store_account = "walletaccount";
const _store_chain = "walletchain";
const _store_record = "transferrecods";
const _store_apps = "walletapps";
const _store_keyinfo = "walletkeyinfo";
const dbversion = 1;
// 数据库实例
let dbInstance = null;

// 初始化数据库并设置全局变量  
async function _initializeDatabase() {  
    const storeConfigs = [  
        {  // 账号信息存储,
            name: _store_account,  
            keyPath: 'account',  
            autoIncrement: false,
            indexes: [
                { name: 'type', keyPath: 'type', unique: false },
                { name: 'credentialid', keyPath: 'credentialid', unique: false },
                { name: 'createtime', keyPath: 'createtime', unique: false }
            ]  
        },  
        {  // 网络信息存储
            name: _store_chain,  
            keyPath: 'chainid',  
            autoIncrement: false,  
            indexes: [{ name: 'chainid', keyPath: 'chainid', unique: true }]  
        },
        {// 转账记录存储
            name: _store_record,  
            keyPath: 'id',  
            autoIncrement: true,  
            indexes: [{ name: 'account', keyPath: 'account', unique: false },{ name: 'chainid', keyPath: 'chainid', unique: false }]  
        },
        {// 已连接的DAPP存储
            name: _store_apps,  
            keyPath: 'appurl',   
            indexes: [{ name: 'timestamp', keyPath: 'timestamp', unique: false }]  
        },
        {// key,value信息存储,主要用来存储非标准信息,连接过的网络信息(固定key:"connectedChain")与最近选择的账号信息(固定key:"chosedAccount")
            name: _store_keyinfo,  
            keyPath: 'key',   
        },
    
    ];  
    const dbHelper = new IndexedDBHelper(dbname, storeConfigs,dbversion);  

    try {  
        dbInstance = await dbHelper.open();  
        console.log('数据库已打开:', dbInstance);  
        return true;
    } catch (error) {  
        console.error('数据库初始化失败:', error);  
        return false;
    }  
}  

const _getAllData = async (storeName: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.getAllData(storeName);
    return data;
  }
};

const _getData = async (storeName: string, key: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.getData(storeName, key);
    return data;
  }
};

const _queryData = async (storeName: string, indexName: string, queryValue: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.queryData(storeName, indexName, queryValue)
    return data;
  }
};
const _addData = async (storeName: string, indexName: string, queryValue: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.addData(storeName, indexName, queryValue)
    return data;
  }
};

const _updateData = async (storeName: string, indexName: string, queryValue: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.updateData(storeName, indexName, queryValue)
    return data;
  }
};

const _deleteData = async (storeName: string, indexName: string, queryValue: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.deleteData(storeName, indexName, queryValue)
    return data;
  }
};

export const store_account = _store_account;
export const store_chain = _store_chain;
export const store_record = _store_record;
export const store_apps = _store_apps;
export const store_keyinfo = _store_keyinfo;

export const initializeDatabase = _initializeDatabase;
export const getAllData = _getAllData;
export const getData = _getData;
export const queryData = _queryData;
export const addData = _addData;
export const updateData = _updateData;
export const deleteData = _deleteData;
const databaseHelper = {
  store_account,
  store_chain,
  store_record,
  store_apps,
  store_keyinfo,
  initializeDatabase,
  getAllData,
  getData,
  queryData,
  addData,
  updateData,
  deleteData
};
export default databaseHelper;