// 授权记录
const AuthRecords = {
  type: "object",
  properties: {
    _id: { type: "string" },
    recordId: { type: "string" }, // 授权记录ID
    appId: { type: "string" },
    appName: { type: "string" },
    appIcon: { type: "string" },
    appUrl: { type: "string" },
    nftAccount: { type: "string" }, // 授权NFT账户
    account: { type: "string" }, // 授权账户,以太坊地址
    timestamp: { type: "number" }, // 授权时间戳
  },
  required: ["_id"],
  additionalProperties: false,
};
const AuthRecordsCollection = {
  name: "auth_records",
  schema: AuthRecords,
};
// 数据库表结构信息
const dbCollections = [
  // 授权记录
  AuthRecordsCollection,
];

const dbVersion = 1;
export { dbCollections, dbVersion };
