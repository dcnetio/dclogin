// import DBHelper from "@/helpers/DBHelper";
import { getDC } from "@/components/auth/login/dc";
import { tableNames } from "@/helpers/threadDBHelper";
import { OrderRecord } from "@/types/pageType";
/**
 * 订单记录
 */
const addOrderRecord = async (record: OrderRecord): Promise<string | null> => {
  try {
    // 添加到threadDB
    const dc = await getDC();
    if (!dc) {
      return null;
    }
    const theadId = dc.dbThreadId;
    if (!theadId) {
      console.error("dbThreadId is missing");
      return null;
    }
    // 每次发布都是新增一条数据
    const [_id, error] = await dc.db.create(
      theadId,
      tableNames.order_records,
      JSON.stringify(record)
    );
    if (error) {
      throw new Error(error.message);
    }
    return _id;
  } catch (error) {
    return null;
  }
};

const updateOrderRecord = async (record: OrderRecord): Promise<boolean> => {
  try {
    // 添加到threadDB
    const dc = await getDC();
    if (!dc) {
      return false;
    }
    const theadId = dc.dbThreadId;
    if (!theadId) {
      console.error("dbThreadId is missing");
      return false;
    }
    // 每次发布都是新增一条数据
    const [_id, error] = await dc.db.save(
      theadId,
      tableNames.order_records,
      JSON.stringify(record)
    );
    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    return false;
  }
};

const getOrderRecordsWithNFT = async (
  nftAccount: string = "",
  orderId: string = ""
): Promise<OrderRecord[]> => {
  try {
    // 查询授权记录
    const dc = await getDC();
    if (!dc) {
      return [];
    }
    const query = {
      condition: "",
      sort: {
        fieldPath: "createTime",
        desc: true,
      },
    };
    const conditions: string[] = [];
    if (nftAccount) {
      conditions.push(` nftAccount = '${nftAccount}' `);
    }
    if (orderId) {
      conditions.push(` orderId = '${orderId}' `);
    }
    if (conditions.length > 0) {
      query.condition = conditions.join(" && ");
    }

    const theadId = dc.dbThreadId;
    if (!theadId) {
      console.error("dbThreadId is missing");
      return [];
    }
    const [res, error] = await dc.db.find(
      theadId,
      tableNames.order_records,
      JSON.stringify(query)
    );
    if (error) {
      throw new Error(error.message);
    }
    const records = JSON.parse(res);
    return records;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderInfoWithOrderId = async (
  orderId: string = ""
): Promise<OrderRecord | null> => {
  try {
    // 添加到threadDB
    const dc = await getDC();
    if (!dc) {
      return null;
    }
    const query = {
      condition: "",
      sort: {
        fieldPath: "createTime",
        desc: true,
      },
    };
    const conditions: string[] = [];
    if (orderId) {
      conditions.push(` orderId = '${orderId}' `);
    }
    const theadId = dc.dbThreadId;
    if (!theadId) {
      console.error("dbThreadId is missing");
      return null;
    }
    const [res, error] = await dc.db.find(
      theadId,
      tableNames.order_records,
      JSON.stringify(query)
    );
    if (error) {
      throw new Error(error.message);
    }
    const records = JSON.parse(res);
    return records[0] || null;
  } catch (error) {
    return null;
  }
};

export {
  addOrderRecord,
  updateOrderRecord,
  getOrderRecordsWithNFT,
  getOrderInfoWithOrderId,
};
