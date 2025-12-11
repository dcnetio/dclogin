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

const getAuthRecordsWithNft = async (
  nftAccount: string = ""
): Promise<AuthRecord[]> => {
  try {
    if (nftAccount === "") {
      const records = await DBHelper.getAllData(DBHelper.auth_record);
      return records;
    }
    const records = await DBHelper.queryData(
      DBHelper.auth_record,
      "nftAccount",
      nftAccount
    );
    return records;
  } catch (error) {
    return [];
  }
};

export { addAuthRecord, getAuthRecordsWithNft };
