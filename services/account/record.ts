import DBHelper from "@/helpers/DBHelper";
import { AuthRecord } from "@/types/pageType";

/**
 * 授权记录
 */

const addAuthRecord = async (record: AuthRecord): Promise<boolean> => {
  try {
    await DBHelper.addData(DBHelper.auth_record, record);
    return true;
  } catch (error) {
    return false;
  }
};

const getAuthRecordsWithAccount = async (
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

export { addAuthRecord, getAuthRecordsWithAccount };
