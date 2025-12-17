// import DBHelper from "@/helpers/DBHelper";
import { getDC } from "@/components/auth/login/dc";
import DBHelper from "@/helpers/DBHelper";
import { AuthRecord } from "@/types/pageType";
const tableName = "auth_records";
/**
 * 授权记录
 */
const addAuthRecordIndex = async (record: AuthRecord): Promise<boolean> => {
  try {
    await DBHelper.addData(DBHelper.auth_record, record);
    return true;
  } catch (error) {
    return false;
  }
};

const deleteAuthRecordIndex = async (recordId: string): Promise<boolean> => {
  try {
    await DBHelper.deleteData(DBHelper.auth_record, recordId);
    return true;
  } catch (error) {
    return false;
  }
};

const getAuthRecordsWithAccountIndex = async (
  account: string = ""
): Promise<AuthRecord[]> => {
  try {
    if (account === "") {
      const records = await DBHelper.getAllData(DBHelper.auth_record);
      return records;
    }
    const records = await DBHelper.queryData(
      DBHelper.auth_record,
      "account",
      account
    );
    return records;
  } catch (error) {
    return [];
  }
};
const addAuthRecord = async (record: AuthRecord): Promise<boolean> => {
  try {
    // 添加到threadDB
    const dc = await getDC();
    if (!dc) {
      return false;
    }
    const theadId = dc.dbThreadId;
    // 每次发布都是新增一条数据
    const [_id, error] = await dc.db.create(
      theadId,
      tableName,
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

const getAuthRecordsWithAccount = async (
  account: string = ""
): Promise<AuthRecord[]> => {
  try {
    // 查询授权记录
    const dc = await getDC();
    if (!dc) {
      return;
    }
    const query = {
      condition: "",
      sort: {
        fieldPath: "timestamp",
        desc: true,
      },
    };
    if (account) {
      query.condition = ` account = '${account}' `;
    }
    const theadId = dc.dbThreadId;
    const [res, error] = await dc.db.find(
      theadId,
      tableName,
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
const getAuthRecordsWithRecordId = async (
  recordId: string = ""
): Promise<AuthRecord[]> => {
  try {
    // 查询授权记录
    const dc = await getDC();
    if (!dc) {
      return;
    }
    const query = {
      condition: "",
      sort: {
        fieldPath: "timestamp",
        desc: true,
      },
    };
    if (recordId) {
      query.condition = ` recordId = '${recordId}' `;
    }
    const theadId = dc.dbThreadId;
    const [res, error] = await dc.db.find(
      theadId,
      tableName,
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

const asyncAuthRecord = async (account: string): Promise<boolean> => {
  const records = await getAuthRecordsWithAccountIndex(account);
  if (records.length === 0) {
    return false;
  }
  for (let i = 0; i < records.length; i++) {
    try {
      // 查询是否存在
      const existList = await getAuthRecordsWithRecordId(records[i].recordId);
      if (existList && existList.length > 0) {
        continue;
      }
      // 不存在则添加
      await addAuthRecord(records[i]);
      await deleteAuthRecordIndex(records[i].recordId);
    } catch (error) {
      console.log("asyncAuthRecord error", error);
    }
  }
  return true;
};

export { addAuthRecordIndex, getAuthRecordsWithAccount, asyncAuthRecord };
