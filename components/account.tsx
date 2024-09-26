import { Button, List, Toast } from "antd-mobile";
import styles from "./account.module.css";
import { useEffect, useState } from "react";
import { getTableAllData, store_account } from "@/helpers/DBHelper";
export default function Account({
  onSuccess,
}) {
  const [list, setList] = useState([]);
  const changeAccount = async (info) => {
    console.log("changeAccount");
    // todo 切换账号，获取账号信息，并进行存储
    const bool = true;
    if(bool){
      onSuccess && onSuccess();
      return;
    }
    Toast.show({
      content: '切换失败',
      position: 'bottom',
    })
  };

  const getAccounts = async () => {
    const data = await getTableAllData(store_account) || []
    setList(data)
  }

  useEffect(() => {
    getAccounts();
  }, [])
  return (
    <div>
      <List header="选择账号">
        {list.map((item, index) => (
          <List.Item key={"account" + index} arrowIcon={false} clickable onClick={()=>changeAccount(item)}>
            {item.name} 
          </List.Item>
        ))}
      </List>
      <div className={styles.btn}>
        <Button color="primary" size="large" block>
          创建账号
        </Button>
      </div>
    </div>
  );
}
