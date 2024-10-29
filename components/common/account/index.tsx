import { List, Toast } from "antd-mobile";
import styles from "./index.module.css";
import { useEffect, useState } from "react";
import { getAllData, store_account } from "@/helpers/DBHelper";
import { AccountInfo } from "@/types/walletTypes";
interface AccountProps {
  onSuccess: (info: AccountInfo) => void; // 定义onSuccess为一个无参数无返回值的函数
}
export default function Account(props: AccountProps) {
  const { onSuccess } = props;
  const [list, setList] = useState([]);
  const changeAccount = async (info: AccountInfo) => {
    console.log("changeAccount");
    // todo 切换账号，获取账号信息，并进行存储store
    const bool = true;
    // todo切换账号
    if (bool) {
      onSuccess?.(info);
      return;
    }
    Toast.show({
      content: "切换失败",
      position: "bottom",
    });
  };

  const getAccounts = async () => {
    const data = (await getAllData(store_account)) || [];
    setList(data);
  };

  useEffect(() => {
    getAccounts();
  }, []);
  return (
    <div>
      <List header="选择账号">
        {list.map((item: AccountInfo, index) => (
          <List.Item
            key={"account" + index}
            arrowIcon={false}
            clickable
            onClick={() => changeAccount(item)}
          >
            {item?.name}
          </List.Item>
        ))}
        {list.length == 0 && (
          <div className={styles.emptyTxt}>暂无账号信息</div>
        )}
      </List>
    </div>
  );
}
