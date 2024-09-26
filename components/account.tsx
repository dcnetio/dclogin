import { Button, List, Toast } from "antd-mobile";
import styles from "./account.module.css";
export default function Account({
  onSuccess,
}) {
  // todo 后期改成从数据库获取
  const list = [
    {
      name: "Account1",
      url: "sadashdqwkeuiqowyeuwqhejkwqhejkwqhkejaswdasdasdds",
    },
    {
      name: "Account2",
      url: "sadashdqwkeuiqowyeuwqhejkwqhejkwqhkejaswdasdasdds",
    },
    {
      name: "Account3",
      url: "sadashdqwkeuiqowyeuwqhejkwqhejkwqhkejaswdasdasdds",
    },
  ];
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
  return (
    <div>
      <List header="选择网络">
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
