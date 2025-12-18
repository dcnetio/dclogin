const tableNames = {
  auth_records: "auth_records",
  order_records: "order_records",
};

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
  name: tableNames.auth_records,
  schema: AuthRecords,
};

const OrderRecords = {
  type: "object",
  properties: {
    _id: { type: "string" },
    dappid: { type: "string" }, // dappid
    orderId: { type: "string" }, // 订单ID
    nftAccount: { type: "string" }, // 购买账户
    pkgId: { type: "number" }, // 套餐ID
    amount: { type: "number" }, // 购买金额
    currency: { type: "string" }, // 货币类型
    status: { type: "number" }, // 订单状态 1.等待确认 2.购买成功
    description: { type: "string" }, // 订单描述
    createTime: { type: "number" }, // 创建时间戳
    updateTime: { type: "number" }, // 更新时间戳
  },
  required: ["_id"],
  additionalProperties: false,
};
const OrderRecordsCollection = {
  name: tableNames.order_records,
  schema: OrderRecords,
};
// 数据库表结构信息
const dbCollections = [
  // 授权记录
  AuthRecordsCollection,
  // 订单记录
  OrderRecordsCollection,
];

const dbVersion = 5;
export { dbCollections, dbVersion, tableNames };
