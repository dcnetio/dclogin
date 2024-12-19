import { List, Popup, Toast } from "antd-mobile";
import styles from "./index.module.css";
import { use, useEffect, useState } from "react";
import DBHelper, { getAllData, store_account } from "@/helpers/DBHelper";
import { AccountInfo } from "@/types/walletTypes";
import { useTranslation } from "react-i18next";
interface AccountProps {
  visible: boolean;
  onSuccess: (info: AccountInfo) => void; // 定义onSuccess为一个无参数无返回值的函数
}
export default function Account(props: AccountProps) {
  const { visible, onSuccess } = props;
  const { t } = useTranslation();
  const [accountVisible, setAccountVisible] = useState(visible);
  const [list, setList] = useState([]);
  const changeAccount = async (info: AccountInfo) => {
    console.log("changeAccount");
    // todo 切换账号，获取账号信息，并进行存储store
    await DBHelper.updateData(DBHelper.store_keyinfo, {
      key: "choosedAccount",
      value: info,
    });
    const bool = true;
    // todo切换账号
    if (bool) {
      onSuccess?.(info);
      return;
    }
    Toast.show({
      content: t("account.switch_failed"),
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
    <Popup
      visible={accountVisible}
      onMaskClick={() => {
        setAccountVisible(false);
      }}
      onClose={() => {
        setAccountVisible(false);
      }}
    >
      <List header={t("account.choose")}>
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
          <div className={styles.emptyTxt}>{t("account.empty")}</div>
        )}
      </List>
    </Popup>
  );
}
