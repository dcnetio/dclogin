// import DBHelper from "@/helpers/DBHelper";
import { getDC } from "@/components/auth/login/dc";
import { AuthRecord } from "@/types/pageType";
const tableName = "auth_records";
/**
 * 授权记录
 */

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
    const [records, error] = await dc.db.find(
      theadId,
      tableName,
      JSON.stringify(query)
    );
    if (error) {
      throw new Error(error.message);
    }
    return records;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { addAuthRecord, getAuthRecordsWithAccount };
