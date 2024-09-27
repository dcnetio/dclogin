import { Button, List, Toast } from "antd-mobile";
import styles from "./account.module.css";
import { useEffect, useState } from "react";
import { getAllData, store_account } from "@/helpers/DBHelper";
import { store } from "@/lib/store";
import { saveAccountInfo } from "@/lib/slices/walletSlice";
export default function Account({
  onSuccess,
}) {
  const [list, setList] = useState([]);
  const changeAccount = async (info) => {
    console.log("changeAccount");
    // todo 切换账号，获取账号信息，并进行存储store
    const bool = true;
    store.dispatch(
      saveAccountInfo({
        name: 'Account' + 1, // todo 暂时定1，后期根据account个数调整
        address: 'wallet.address'
      })
    );
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
    const data = await getAllData(store_account) || []
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
        { list.length == 0 && <div className={styles.emptyTxt}>
          暂无账号信息
        </div>}
      </List>
    </div>
  );
}
