import IndexedDBHelper from "./indexedDBHelper";

/**
 * 初始化
 */
const dbname = 'dcwallet';
const _store_account = 'walletaccount';
const _store_chain = 'walletchain';
const _store_record = 'transferrecods';
const _store_apps = 'walletapps';
const _store_keyinfo = 'walletkeyinfo';
const dbversion = 1;
// 数据库实例
let dbInstance = null;

// 初始化数据库并设置全局变量
async function _initializeDatabase() {
  const storeConfigs = [
    {
      // 账号信息存储,
      name: _store_account,
      keyPath: "account",
      autoIncrement: false,
      indexes: [
        { name: "type", keyPath: "type", unique: false },
        { name: "credentialid", keyPath: "credentialid", unique: false },
        { name: "createtime", keyPath: "createtime", unique: false },
      ],
    },
    {
      // 网络信息存储
      name: _store_chain,
      keyPath: "chainid",
      autoIncrement: false,
      indexes: [{ name: "chainid", keyPath: "chainid", unique: true }],
    },
    {
      // 转账记录存储
      name: _store_record,
      keyPath: "id",
      autoIncrement: true,
      indexes: [
        { name: "account", keyPath: "account", unique: false },
        { name: "chainid", keyPath: "chainid", unique: false },
      ],
    },
    {
      // 已连接的DAPP存储
      name: _store_apps,
      keyPath: "id",
      autoIncrement: true,
      indexes: [{ name: "timestamp", keyPath: "timestamp", unique: false }],
    },
    {
      // key信息存储,主要用来存储经webauthn过程中唯一信息加密的私钥的信息,一般就一条数据
      name: _store_keyinfo,
      keyPath: "key",
    },
  ];
  const dbHelper = new IndexedDBHelper(dbname, storeConfigs, dbversion);

  try {
    dbInstance = await dbHelper.open();
    console.log("数据库已打开:", dbInstance);
    return true;
  } catch (error) {
    console.error("数据库初始化失败:", error);
    return false;
  }
}

const _getTableAllData = async (storeName: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.getAllData(storeName);
    return data;
  }
};


const _getTableDataWithKey = async (storeName: string, key: string) => {
    if (!dbInstance) {
      return null;
    } else {
      const data = await dbInstance.getData(storeName, key);
      return data;
    }
  };
  
export const initializeDatabase = _initializeDatabase;
export const getTableAllData = _getTableAllData;
export const getTableDataWithKey = _getTableDataWithKey;
export const store_account = _store_account;
export const store_chain = _store_chain;
export const store_record = _store_record;
export const store_apps = _store_apps;
export const store_keyinfo = _store_keyinfo;
