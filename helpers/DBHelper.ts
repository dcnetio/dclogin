import IndexedDBHelper from "./indexedDBHelper";

/**
 * DB
 */
const dbname = "dc_wallet";
const _store_account = "wallet_account";
const _store_chain = "wallet_chain";
const _store_record = "transfer_records";
const _store_apps = "wallet_apps";
const _store_keyinfo = "wallet_key_info";
// const _auth_record = "auth_records";
const dbversion = 8;
// 数据库实例
let dbInstance: IndexedDBHelper | null = null;

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
        { name: "credentialId", keyPath: "credentialId", unique: false },
        { name: "createtime", keyPath: "createtime", unique: false },
      ],
    },
    {
      // 网络信息存储
      name: _store_chain,
      keyPath: "chainId",
      autoIncrement: false,
      indexes: [{ name: "chainId", keyPath: "chainId", unique: true }],
    },
    {
      // 交易记录存储
      name: _store_record,
      keyPath: "hash",
      indexes: [
        { name: "chainId", keyPath: "chainId", unique: false },
        { name: "blockNumber", keyPath: "blockNumber", unique: false },
        { name: "status", keyPath: "status", unique: false },
        { name: "value", keyPath: "value", unique: false },
        { name: "timestamp", keyPath: "timestamp", unique: false },
        { name: "from", keyPath: "from", unique: false },
        { name: "to", keyPath: "to", unique: false },
      ],
    },
    {
      // 已连接的DAPP存储
      name: _store_apps,
      keyPath: "appUrl",
      indexes: [{ name: "timestamp", keyPath: "timestamp", unique: false }],
    },
    {
      // key,value信息存储,主要用来存储非标准信息,连接过的网络信息(固定key:"connectedChain")与最近选择的账号信息(固定key:"chosedAccount")
      name: _store_keyinfo,
      keyPath: "key",
    },
    // {
    //   // 授权记录
    //   name: _auth_record,
    //   keyPath: "recordId", // 记录id，用于唯一标识授权记录
    //   indexes: [
    //     { name: "appId", keyPath: "appId", unique: false },
    //     { name: "nftAccount", keyPath: "nftAccount", unique: false },
    //     { name: "account", keyPath: "account", unique: false },
    //   ],
    // },
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

const _getAllData = async (storeName: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.getAllData(storeName);
    return data;
  }
};

const _getData = async (storeName: string, key: string | number) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.getData(storeName, key);
    return data;
  }
};

const _queryData = async (
  storeName: string,
  indexName: string,
  queryValue: string
) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.queryData(storeName, indexName, queryValue);
    return data;
  }
};
const _addData = async (storeName: string, info: any) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.addData(storeName, info);
    return data;
  }
};

const _updateData = async (storeName: string, info: any) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.updateData(storeName, info);
    return data;
  }
};

const _deleteData = async (storeName: string, key: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.deleteData(storeName, key);
    return data;
  }
};

const _clearData = async (storeName: string) => {
  if (!dbInstance) {
    return null;
  } else {
    const data = await dbInstance.clearData(storeName);
    return data;
  }
};

export const store_account = _store_account;
export const store_chain = _store_chain;
export const store_record = _store_record;
export const store_apps = _store_apps;
export const store_keyinfo = _store_keyinfo;
// export const auth_record = _auth_record;

export const initializeDatabase = _initializeDatabase;
export const getAllData = _getAllData;
export const getData = _getData;
export const queryData = _queryData;
export const addData = _addData;
export const updateData = _updateData;
export const deleteData = _deleteData;
export const clearData = _clearData;
const databaseHelper = {
  store_account,
  store_chain,
  store_record,
  store_apps,
  store_keyinfo,
  // auth_record,
  initializeDatabase,
  getAllData,
  getData,
  queryData,
  addData,
  updateData,
  deleteData,
  clearData,
};
export default databaseHelper;
