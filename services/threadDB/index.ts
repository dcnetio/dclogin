/**
 * 数据库threadDB
 */

import { getDC } from "@/components/auth/login/dc";
import { dbCollections, dbVersion } from "@/helpers/threadDBHelper";

const initUserDB = async (): Promise<string> => {
  try {
    const dc = await getDC();
    if (!dc) {
      throw new Error("未获取到有效的 DC 实例");
    }
    const [dbInfo, err] = await dc.initUserDB(dbCollections, dbVersion, false);

    if (err) {
      throw new Error(err.message);
    } else {
      return dbInfo.id;
    }
  } catch (err) {
    console.error(err);
    throw new Error("初始化数据库失败:" + err.message);
  }
};

export { initUserDB };
